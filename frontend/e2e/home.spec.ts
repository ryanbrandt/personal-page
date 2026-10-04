import { GITHUB_URL, LINKEDIN_URL } from "../src/common/constants/urls";
import { CONTENT } from "../src/content";

import {
  expect,
  HOME_HEADING,
  pageSection,
  pageTitle,
  projectCardLink,
  projectCards,
  projectDialog,
  test,
  timelineEntries,
  VIEWPORTS,
} from "./helpers";

const JOBS = CONTENT.experience;

// The projects started most recently, newest first (by Date.parse, not the
// app's own string comparison, so a bug there shows).
const RECENT_PROJECTS = CONTENT.projects
  .toSorted((a, b) => Date.parse(b.start) - Date.parse(a.start))
  .slice(0, 3);
const CURRENT_JOB = JOBS.find(({ end }) => end === null)!;

// Layout: the hero's eyebrow at both widths.
for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(viewportName, () => {
    test.use({ viewport });

    test("the current job shows above the heading", async ({ page }) => {
      await page.goto("/");

      // It comes after the heading in the markup but shows above it.
      const eyebrow = page
        .getByRole("main")
        .getByText(`${CURRENT_JOB.title} at ${CURRENT_JOB.organization}`, {
          exact: true,
        });
      await expect(eyebrow).toBeVisible();
      const eyebrowBox = (await eyebrow.boundingBox())!;
      const headingBox = (await pageTitle(page, HOME_HEADING).boundingBox())!;
      expect(eyebrowBox.y).toBeLessThan(headingBox.y);
    });
  });
}

// Behaviour, once.
test.describe("desktop", () => {
  test.use({ viewport: VIEWPORTS.desktop });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("the hero links to the résumé, the projects and Ryan's profiles", async ({
    page,
  }) => {
    const main = page.getByRole("main");

    for (const [name, href] of [
      ["View résumé", "/resume"],
      ["Personal projects", "/work"],
    ]) {
      await expect(
        main.getByRole("link", { name, exact: true })
      ).toHaveAttribute("href", href);
    }

    for (const [name, href] of [
      ["LinkedIn", LINKEDIN_URL],
      ["GitHub", GITHUB_URL],
    ]) {
      const link = main.getByRole("link", { name, exact: true });
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  test("a call to action navigates in the app", async ({ page }) => {
    // Set on this document only: a full page load would drop it.
    await page.evaluate(() => Object.assign(window, { sameDocument: true }));

    await page
      .getByRole("main")
      .getByRole("link", { name: "View résumé" })
      .click();
    await expect(page).toHaveURL("/resume");
    await expect(pageTitle(page, "Résumé")).toBeFocused();
    expect(await page.evaluate(() => "sameDocument" in window)).toBe(true);
  });

  test("experience lists the jobs and links to the résumé", async ({
    page,
  }) => {
    const experience = pageSection(page, "Experience");

    await expect(
      timelineEntries(experience).getByRole("heading", { level: 3 })
    ).toHaveText(JOBS.map(({ title }) => title));
    await expect(
      experience.getByRole("link", { name: "Full résumé" })
    ).toHaveAttribute("href", "/resume");
  });

  test("recent projects are the newest and link to all of them", async ({
    page,
  }) => {
    await expect(
      projectCards(page).getByRole("heading", { level: 3 })
    ).toHaveText(RECENT_PROJECTS.map(({ title }) => title));
    await expect(
      pageSection(page, "Recent projects").getByRole("link", {
        name: "All projects",
      })
    ).toHaveAttribute("href", "/work");
  });

  test("a recent project opens its dialog; closing refocuses its card", async ({
    page,
  }) => {
    const [project] = RECENT_PROJECTS;
    const card = projectCardLink(page, project.title);
    const dialog = projectDialog(page);

    await card.click();
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName(project.title);
    await expect(page).toHaveURL(`/work/${project.slug}`);
    await expect(dialog.locator(":focus")).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL("/");
    // The home page remounts with focus back on the card, where it was.
    await expect(card).toBeFocused();
    await expect(card).toBeInViewport();
    await expect(pageTitle(page, HOME_HEADING)).not.toBeFocused();
  });

  test("the largest paint is the hero's text", async ({ page }) => {
    // Chromium only reports these entries to an observer
    // (getEntriesByType warns that it's deprecated for them); `buffered`
    // replays the ones already recorded.
    const lcp = await page.evaluate(
      () =>
        new Promise<{ url: string; inHeading: boolean }>((resolve, reject) => {
          setTimeout(
            () => reject(new Error("No largest-contentful-paint entry in 5s")),
            5_000
          );
          new PerformanceObserver((list) => {
            const entry = list.getEntries().at(-1) as LargestContentfulPaint;
            resolve({
              url: entry.url,
              inHeading: !!entry.element?.closest("h1"),
            });
          }).observe({ type: "largest-contentful-paint", buffered: true });
        })
    );

    // Text, not an image (which would have a URL).
    expect(lcp).toEqual({ url: "", inHeading: true });
  });
});
