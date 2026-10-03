import { GITHUB_URL, LINKEDIN_URL } from "../src/common/constants/urls";
import { WORK_ENTRIES as JOBS } from "../src/repositories/resume";
import { WORK_ENTRIES as PROJECTS } from "../src/repositories/work";

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

// The projects started most recently, newest first (by Date.parse, not the
// app's own parser, so a bug there shows).
const RECENT_PROJECTS = PROJECTS.toSorted(
  (a, b) => Date.parse(`1 ${b.start}`) - Date.parse(`1 ${a.start}`)
).slice(0, 3);
const CURRENT_JOB = JOBS.find(({ endDate }) => endDate === null)!;

for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(viewportName, () => {
    test.use({ viewport });

    test.beforeEach(async ({ page }) => {
      await page.goto("/");
    });

    test("the hero has the name, the current job and the links", async ({
      page,
    }) => {
      const main = page.getByRole("main");
      const heading = pageTitle(page, HOME_HEADING);
      await expect(main.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(heading).toBeVisible();

      // The eyebrow comes after the heading in the markup but shows above it.
      const eyebrow = main.getByText(
        `${CURRENT_JOB.title} at ${CURRENT_JOB.organization}`,
        { exact: true }
      );
      await expect(eyebrow).toBeVisible();
      const eyebrowBox = (await eyebrow.boundingBox())!;
      const headingBox = (await heading.boundingBox())!;
      expect(eyebrowBox.y).toBeLessThan(headingBox.y);

      for (const [name, href] of [
        ["View résumé", "/resume"],
        ["Personal projects", "/work"],
      ]) {
        const link = main.getByRole("link", { name, exact: true });
        await expect(link).toHaveAttribute("href", href);
        expect((await link.boundingBox())!.height).toBe(48);
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

    test("the calls to action navigate in the app", async ({ page }) => {
      const main = page.getByRole("main");
      // Set on this document only: a full page load would drop it.
      await page.evaluate(() => Object.assign(window, { sameDocument: true }));

      await main.getByRole("link", { name: "View résumé" }).click();
      await expect(page).toHaveURL("/resume");
      await expect(pageTitle(page, "Résumé")).toBeFocused();

      await page.goBack();
      await main.getByRole("link", { name: "Personal projects" }).click();
      await expect(page).toHaveURL("/work");
      await expect(pageTitle(page, "Recent Personal Projects")).toBeFocused();
      expect(await page.evaluate(() => "sameDocument" in window)).toBe(true);
    });

    test("experience lists the jobs and links to the résumé", async ({
      page,
    }) => {
      const experience = pageSection(page, "Experience");
      const items = timelineEntries(experience);

      await expect(items.getByRole("heading", { level: 3 })).toHaveText(
        JOBS.map(({ title }) => title)
      );
      for (const [index, job] of JOBS.entries()) {
        await expect(items.nth(index)).toContainText(job.organization);
      }

      await experience.getByRole("link", { name: "Full résumé" }).click();
      await expect(page).toHaveURL("/resume");
    });

    test("recent projects are the newest and link to all of them", async ({
      page,
    }) => {
      await expect(
        projectCards(page).getByRole("heading", { level: 3 })
      ).toHaveText(RECENT_PROJECTS.map(({ title }) => title));

      await pageSection(page, "Recent projects")
        .getByRole("link", { name: "All projects" })
        .click();
      await expect(page).toHaveURL("/work");
    });

    // The cards push a plain /work/:slug entry (no IWorkEntryLocationState),
    // so closing replaces it with /work rather than going back home.
    test("a recent project opens on the projects page; closing stays there", async ({
      page,
    }) => {
      const [project] = RECENT_PROJECTS;
      const dialog = projectDialog(page);

      await projectCardLink(page, project.title).click();
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAccessibleName(project.title);
      await expect(page).toHaveURL(`/work/${project.slug}`);

      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(page).toHaveURL("/work");
      // Focus isn't lost: it lands on the project's card on the grid.
      await expect(projectCardLink(page, project.title)).toBeFocused();

      // The dialog's entry was replaced, so Back goes home.
      await page.goBack();
      await expect(page).toHaveURL("/");
      await expect(pageTitle(page, HOME_HEADING)).toBeFocused();
    });

    test("the largest paint is the hero's text", async ({ page }) => {
      const lcp = await page.evaluate(
        () =>
          new Promise<{ url: string; inHeading: boolean }>((resolve) => {
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
}
