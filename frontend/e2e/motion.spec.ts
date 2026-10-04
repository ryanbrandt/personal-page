import type { Page } from "@playwright/test";

import { CONTENT } from "../src/content";

import {
  expect,
  HOME_HEADING,
  pageTitle,
  primaryNav,
  projectCardLink,
  projectDialog,
  test,
  VIEWPORTS,
  waitForStableRender,
} from "./helpers";

// The newest project: on the home page as well as the projects page.
const PROJECT = CONTENT.projects.toSorted(
  (a, b) => Date.parse(b.start) - Date.parse(a.start)
)[0];

/** Counts, in `window.viewTransitions`, the View Transitions the page starts. */
const countViewTransitions = (page: Page) =>
  page.addInitScript(() => {
    const counter = window as unknown as { viewTransitions: number };
    counter.viewTransitions = 0;
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = (update) => {
      counter.viewTransitions++;
      return start(update);
    };
  });

const viewTransitions = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { viewTransitions: number }).viewTransitions
  );

/** The page's running and filling animations, by what they animate. */
const animations = (page: Page) =>
  page.evaluate(() =>
    document
      .getAnimations()
      .map(
        ({ effect }) =>
          (effect as KeyframeEffect).pseudoElement ??
          (effect as KeyframeEffect).target?.className
      )
  );

/** A Layout Instability API entry (not in TypeScript's DOM types) */
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

const navLink = (page: Page, name: string) =>
  primaryNav(page).getByRole("link", { name, exact: true });

test.use({ viewport: VIEWPORTS.desktop });

test.describe("with motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test.beforeEach(async ({ page }) => {
    await countViewTransitions(page);
  });

  test("a new page cross-fades; a project's dialog over its page doesn't", async ({
    page,
  }) => {
    await page.goto("/");

    await navLink(page, "Projects").click();
    await expect(page).toHaveURL("/work");
    await expect(pageTitle(page, "Recent Personal Projects")).toBeFocused();
    expect(await viewTransitions(page)).toBe(1);

    // The dialog animates itself.
    await projectCardLink(page, PROJECT.title).click();
    await expect(projectDialog(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(projectDialog(page)).toBeHidden();
    await expect(page).toHaveURL("/work");
    expect(await viewTransitions(page)).toBe(1);

    // Back to another page cross-fades too.
    await page.goBack();
    await expect(page).toHaveURL("/");
    await expect(pageTitle(page, HOME_HEADING)).toBeFocused();
    expect(await viewTransitions(page)).toBe(2);
  });

  test("the hero's title shows at once, as it's the largest paint", async ({
    page,
  }) => {
    await page.goto("/");
    const title = pageTitle(page, HOME_HEADING);

    expect(await title.evaluate((h1) => h1.getAnimations().length)).toBe(0);
    await waitForStableRender(page);
    expect(await animations(page)).toEqual([]);
  });

  test("changing pages doesn't shift the layout", async ({ page }) => {
    await page.goto("/");
    await waitForStableRender(page);
    // Page changes only: the first load's shift (the web font swapping in)
    // isn't motion's.
    await page.evaluate(() => {
      const shifts = window as unknown as { layoutShift: number };
      shifts.layoutShift = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<LayoutShift>) {
          // As the CLS metric counts them: not right after a click.
          if (!entry.hadRecentInput) shifts.layoutShift += entry.value;
        }
      }).observe({ type: "layout-shift" });
    });

    for (const name of ["Résumé", "Projects", "Contact", "Home"]) {
      await navLink(page, name).click();
      await waitForStableRender(page);
    }
    // Back and forward, which aren't input, so every shift would count.
    for (const step of [-1, -1, 1] as const) {
      await (step < 0 ? page.goBack() : page.goForward());
      await waitForStableRender(page);
    }

    expect(
      await page.evaluate(
        () => (window as unknown as { layoutShift: number }).layoutShift
      )
    ).toBe(0);
  });
});

test.describe("under reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test.beforeEach(async ({ page }) => {
    await countViewTransitions(page);
  });

  test("nothing animates; focus and URLs are as with motion", async ({
    page,
  }) => {
    await page.goto("/");
    expect(await animations(page)).toEqual([]);

    await navLink(page, "Résumé").click();
    await expect(page).toHaveURL("/resume");
    await expect(pageTitle(page, "Résumé")).toBeFocused();
    expect(await animations(page)).toEqual([]);

    await navLink(page, "Home").click();
    await expect(page).toHaveURL("/");
    await expect(pageTitle(page, HOME_HEADING)).toBeFocused();
    expect(await animations(page)).toEqual([]);

    // A project's dialog from the home page closes back to its card.
    const card = projectCardLink(page, PROJECT.title);
    await card.click();
    await expect(projectDialog(page)).toBeVisible();
    await expect(page).toHaveURL(`/work/${PROJECT.slug}`);
    expect(await animations(page)).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(page).toHaveURL("/");
    await expect(card).toBeFocused();
    expect(await animations(page)).toEqual([]);

    expect(await viewTransitions(page)).toBe(0);
  });
});
