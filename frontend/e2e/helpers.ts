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

/** The narrowest width the page must fit without scrolling sideways (WCAG Reflow). */
export const NARROWEST_VIEWPORT = { width: 320, height: 568 } as const;

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

/** The project cards on the projects page */
export const projectCards = (page: Page) =>
  page.getByRole("main").getByRole("article");

/** A project card's link, its title, which opens the project's dialog */
export const projectCardLink = (page: Page, title: string) =>
  projectCards(page).getByRole("link", { name: title, exact: true });

/** The open project dialog */
export const projectDialog = (page: Page) => page.getByRole("dialog");

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
 * the test fails if the page logs a warning or error, or throws (unless it
 * sets `failOnConsoleProblems: false`).
 */
export const test = base.extend<{
  failOnConsoleProblems: boolean;
  remoteImages: void;
  consoleProblems: void;
}>({
  failOnConsoleProblems: [true, { option: true }],
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
    async ({ page, failOnConsoleProblems }, use) => {
      const problems: Array<string> = [];
      page.on("console", (message) => {
        if (message.type() === "warning" || message.type() === "error") {
          problems.push(`${message.type()}: ${message.text()}`);
        }
      });
      page.on("pageerror", (error) => problems.push(`pageerror: ${error}`));
      await use();
      if (failOnConsoleProblems) {
        expect(problems, "console warnings and errors").toEqual([]);
      }
    },
    { auto: true },
  ],
});

export { expect };

const BLOCKING_IMPACTS = ["serious", "critical"];

/**
 * Checks the page with axe: no serious or critical violations, apart from
 * the route's known ones for this viewport (only that rule, on only those
 * elements). Each known violation must still be there, so this fails once
 * its fix lands and the entry can go.
 */
export async function expectNoBlockingAxeViolations(
  page: Page,
  route: AppRoute,
  viewportName: ViewportName
): Promise<void> {
  const known = (route.knownViolations ?? []).filter(({ viewports }) =>
    viewports.includes(viewportName)
  );
  const expiredMessage = ({ rule, selector, fixedBy }: KnownViolation) =>
    `${rule} on ${selector} is gone (fixed by ${fixedBy}?): remove it from knownViolations`;

  for (const violation of known) {
    expect(
      await page.locator(violation.selector).count(),
      expiredMessage(violation)
    ).toBeGreaterThan(0);
  }

  const { violations } = await new AxeBuilder({ page }).analyze();
  const blocking: Array<{ id: string; target: string }> = [];
  const seen = new Set<KnownViolation>();
  for (const { id, impact, nodes } of violations) {
    for (const { target } of nodes) {
      const selector = target.join(" ");
      const knownViolation = await findKnownViolation(
        page,
        known,
        id,
        selector
      );
      if (knownViolation) {
        seen.add(knownViolation);
      } else if (BLOCKING_IMPACTS.includes(impact ?? "")) {
        blocking.push({ id, target: selector });
      }
    }
  }

  expect(blocking).toEqual([]);
  for (const violation of known) {
    expect(seen.has(violation), expiredMessage(violation)).toBe(true);
  }
}

/** The known violation of `rule` that covers the element at `target`, if any. */
async function findKnownViolation(
  page: Page,
  known: ReadonlyArray<KnownViolation>,
  rule: string,
  target: string
): Promise<KnownViolation | undefined> {
  for (const violation of known) {
    if (violation.rule !== rule) continue;
    const covered = await page
      .locator(target)
      .evaluate(
        (element, selector) => element.matches(selector),
        violation.selector
      );
    if (covered) return violation;
  }
  return undefined;
}

/** The page doesn't scroll sideways. */
export async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, "the page's scroll width").toBeLessThanOrEqual(
    clientWidth
  );
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
