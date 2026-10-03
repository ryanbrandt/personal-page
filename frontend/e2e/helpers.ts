import path from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test as base, type Page } from "@playwright/test";

import { HOME_TITLE, toDocumentTitle } from "../src/common/utils/documentTitle";

// The app switches to its mobile layout at widths <= 1040px (`mobile-only` in
// src/styles/_mixins.scss), and the header moves its links into a menu below
// 768px (the library's NavBar).
export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

export type ViewportName = keyof typeof VIEWPORTS;

/** An axe violation a later ticket fixes, skipped until then. */
interface KnownViolation {
  rule: string;
  selector: string;
  viewports: ReadonlyArray<ViewportName>;
  fixedBy: string;
}

interface AppRoute {
  name: string;
  path: string;
  /** The page's <h1> */
  title: string;
  /** The browser tab title */
  documentTitle: string;
  knownViolations?: ReadonlyArray<KnownViolation>;
}

export const ROUTES: ReadonlyArray<AppRoute> = [
  {
    name: "home",
    path: "/",
    title: "Hello, World!",
    documentTitle: HOME_TITLE,
  },
  {
    name: "resume",
    path: "/resume",
    title: "Résumé",
    documentTitle: toDocumentTitle("Résumé"),
  },
  {
    name: "work",
    path: "/work",
    title: "Recent Personal Projects",
    documentTitle: toDocumentTitle("Projects"),
    knownViolations: [
      // The card titles fade to half opacity until hovered, on desktop.
      {
        rule: "color-contrast",
        selector: ".work-page__results-display__result > label",
        viewports: ["desktop"],
        fixedBy: "R5",
      },
    ],
  },
  {
    name: "not-found",
    path: "/does-not-exist",
    title: "Page not found",
    documentTitle: toDocumentTitle("Page not found"),
  },
];

export const pageTitle = (page: Page, title: string) =>
  page.getByRole("heading", { level: 1, name: title, exact: true });

export const projectDetails = (page: Page) =>
  page.locator(".work-page__results-display__result__details-overlay");

export const brandLink = (page: Page) =>
  page.getByRole("banner").getByRole("link", { name: "Ryan Brandt" });

export const primaryNav = (page: Page) =>
  page.getByRole("navigation", { name: "Primary" });

/** The header's menu button, shown while the header is narrow. */
export const menuButton = (page: Page) =>
  page.getByRole("button", { name: "Menu" });

export const themeOption = (page: Page, name: "Light" | "Dark" | "System") =>
  page.getByRole("radiogroup", { name: "Theme" }).getByRole("radio", { name });

const REMOTE_IMAGES = "https://resume-work-images.s3.amazonaws.com/**";
const FIXTURES_DIR = path.join(import.meta.dirname, "fixtures");

/**
 * Playwright's `test`, plus two automatic fixtures for every test: project
 * images are served from committed copies so S3 can't flake the suite, and
 * the test fails if the page logs a warning or error, or throws.
 */
export const test = base.extend<{
  remoteImages: void;
  consoleProblems: void;
}>({
  remoteImages: [
    async ({ page }, use) => {
      await page.route(REMOTE_IMAGES, (route) => {
        const fileName = decodeURIComponent(
          new URL(route.request().url()).pathname.slice(1).replaceAll("+", " ")
        );
        return route.fulfill({ path: path.join(FIXTURES_DIR, fileName) });
      });
      await use();
    },
    { auto: true },
  ],
  consoleProblems: [
    async ({ page }, use) => {
      const problems: Array<string> = [];
      page.on("console", (message) => {
        if (message.type() === "warning" || message.type() === "error") {
          problems.push(`${message.type()}: ${message.text()}`);
        }
      });
      page.on("pageerror", (error) => problems.push(`pageerror: ${error}`));
      await use();
      expect(problems, "console warnings and errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

const BLOCKING_IMPACTS = ["serious", "critical"];

/**
 * Checks the page with axe: no serious or critical violations, apart from
 * the route's known ones for this viewport. Each known violation must still
 * fail, so this fails once its fix lands and the exclusion can go.
 */
export async function expectNoBlockingAxeViolations(
  page: Page,
  route: AppRoute,
  viewportName: ViewportName
): Promise<void> {
  const known = (route.knownViolations ?? []).filter(({ viewports }) =>
    viewports.includes(viewportName)
  );

  const builder = new AxeBuilder({ page });
  for (const { selector } of known) builder.exclude(selector);
  const { violations } = await builder.analyze();
  const blocking = violations
    .filter(({ impact }) => BLOCKING_IMPACTS.includes(impact ?? ""))
    .map(({ id, nodes }) => ({
      id,
      targets: nodes.map(({ target }) => target.join(" ")),
    }));
  expect(blocking).toEqual([]);

  for (const { rule, selector, fixedBy } of known) {
    const { violations: stillFailing } = await new AxeBuilder({ page })
      .include(selector)
      .withRules([rule])
      .analyze();
    expect(
      stillFailing.map(({ id }) => id),
      `${rule} on ${selector} passes now (fixed by ${fixedBy}?): remove it from knownViolations`
    ).toContain(rule);
  }
}

/**
 * Navigates to `path` and waits until the page is visually settled: the
 * clock is frozen (the footer shows the current year) and the page has a
 * stable render (see waitForStableRender).
 * The theme needs no wait: index.html applies it before the first paint.
 */
export async function gotoAndSettle(page: Page, path: string): Promise<void> {
  await page.clock.setFixedTime(new Date("2026-01-01T12:00:00Z"));
  await page.goto(path);
  await waitForStableRender(page);
}

/**
 * Waits until nothing on the page is still changing: web fonts are loaded,
 * images have decoded, CSS animations (e.g. the project modal's fade/scale)
 * have finished, and the browser has painted the final frame.
 */
export async function waitForStableRender(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() =>
    Array.from(document.images).every((img) => img.complete)
  );
  await page.evaluate(async () => {
    // Infinite animations (e.g. a loading spinner) never finish, so only wait
    // on ones that end. Re-check a few times: finishing one can start another
    // (react-transition-group swaps -enter for -enter-active).
    const runningFinite = () =>
      document
        .getAnimations()
        .filter(
          (a) =>
            a.playState === "running" &&
            a.effect?.getComputedTiming().endTime !== Infinity
        );
    for (let round = 0; round < 5 && runningFinite().length > 0; round++) {
      // A cancelled animation rejects `finished`; it has stopped either way.
      await Promise.all(
        runningFinite().map((a) => a.finished.catch(() => undefined))
      );
    }

    const nextFrame = () =>
      new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await nextFrame();
    await nextFrame();
  });
}
