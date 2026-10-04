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

/**
 * The layout shift, every entry summed (even right after a click, which CLS
 * would forgive), while changing pages: through the nav links, then back
 * and forward, ending on the home page.
 */
async function layoutShiftChangingPages(page: Page): Promise<number> {
  await page.goto("/");
  await waitForStableRender(page);
  // From here: the first load's shift (the web font swapping in) isn't
  // a page change's.
  await page.evaluate(() => {
    const shifts = window as unknown as { layoutShift: number };
    shifts.layoutShift = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<LayoutShift>) {
        shifts.layoutShift += entry.value;
      }
    }).observe({ type: "layout-shift" });
  });

  for (const name of ["Résumé", "Projects", "Contact", "Home"]) {
    await navLink(page, name).click();
    await waitForStableRender(page);
  }
  // Back to Contact and Projects, then forward to Contact and Home.
  for (const step of ["back", "back", "forward", "forward"] as const) {
    await (step === "back" ? page.goBack() : page.goForward());
    await waitForStableRender(page);
  }
  await expect(page).toHaveURL("/");

  return page.evaluate(
    () => (window as unknown as { layoutShift: number }).layoutShift
  );
}

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

  test("the hero's lines rise in; its title, the largest paint, shows at once", async ({
    page,
  }) => {
    await page.goto("/");
    const hero = page.locator(".home-hero");

    expect(
      await hero.evaluate((section) =>
        Array.from(section.children, (child) => ({
          title: child.matches("h1"),
          animation: getComputedStyle(child).animationName,
        }))
      )
    ).toEqual([
      { title: true, animation: "none" },
      ...Array(4).fill({ title: false, animation: "home-hero-rise" }),
    ]);
    // And nothing is left running or applied once it ends.
    await waitForStableRender(page);
    expect(await animations(page)).toEqual([]);
  });

  test("history steps faster than a cross-fade end on the last one", async ({
    page,
  }) => {
    await page.goto("/");
    await navLink(page, "Projects").click();
    await projectCardLink(page, PROJECT.title).click();
    await expect(projectDialog(page)).toBeVisible();
    await page.goBack();
    await page.goBack();
    await expect(page).toHaveURL("/");
    await waitForStableRender(page);

    // Forward to the projects (a cross-fade) and, before its update, on to
    // the project's dialog (the same page, so no cross-fade).
    await page.evaluate(() => {
      history.forward();
      history.forward();
    });

    await expect(page).toHaveURL(`/work/${PROJECT.slug}`);
    await waitForStableRender(page);
    await expect(projectDialog(page)).toBeVisible();
  });

  test("Back from a project's dialog keeps the page's scroll", async ({
    page,
  }) => {
    await page.goto("/work");
    const card = projectCardLink(page, PROJECT.title);
    await card.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 200));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    await card.click();
    await expect(projectDialog(page)).toBeVisible();
    await page.goBack();

    await expect(page).toHaveURL("/work");
    await expect(projectDialog(page)).toBeHidden();
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
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

// Short pages (e.g. Contact) show the footer, which a long page puts below
// the fold; a page change moves it, with or without motion. Motion must
// add nothing to that.
test("motion shifts the layout no more than changing pages does", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const withoutMotion = await layoutShiftChangingPages(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const withMotion = await layoutShiftChangingPages(page);

  expect(withMotion).toBe(withoutMotion);
});
