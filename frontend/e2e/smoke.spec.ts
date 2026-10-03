import type { Locator, Page } from "@playwright/test";

import { RESUME_PDF_URL } from "../src/common/constants/urls";

import {
  brandLink,
  expect,
  expectNoHorizontalScroll,
  menuButton,
  NARROWEST_VIEWPORT,
  pageTitle,
  primaryNav,
  projectDetails,
  ROUTES,
  test,
  themeOption,
  VIEWPORTS,
} from "./helpers";

const PROJECT_COUNT = 5;

const BLACK = "rgb(0, 0, 0)";
const WHITE = "rgb(255, 255, 255)";
const TRANSPARENT = "rgba(0, 0, 0, 0)";

const resumeSection = (page: Page, name: string) =>
  page.getByRole("main").locator("section", {
    has: page.getByRole("heading", { level: 2, name, exact: true }),
  });

const timelineEntries = (section: Locator) => section.locator(".timeline > li");

test.describe("desktop", () => {
  test.use({ viewport: VIEWPORTS.desktop });

  for (const route of ROUTES) {
    test(`${route.path} renders its title`, async ({ page }) => {
      await page.goto(route.path);
      await expect(pageTitle(page, route.title)).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page).toHaveTitle(route.documentTitle);
    });
  }

  test("exactly the current route's nav link is marked current", async ({
    page,
  }) => {
    const nav = primaryNav(page);
    const current = nav.locator('[aria-current="page"]');

    await page.goto("/");
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText("Home");

    for (const label of ["Résumé", "Projects"]) {
      await nav.getByRole("link", { name: label }).click();
      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(label);
    }

    // A trailing slash still matches its route.
    await page.goto("/resume/");
    await expect(current).toHaveText("Résumé");
  });

  test("nav links navigate between routes", async ({ page }) => {
    await page.goto("/");
    const nav = primaryNav(page);

    await nav.getByRole("link", { name: "Résumé" }).click();
    await expect(page).toHaveURL("/resume");
    await expect(pageTitle(page, "Résumé")).toBeVisible();

    await nav.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL("/work");
    await expect(pageTitle(page, "Recent Personal Projects")).toBeVisible();

    await nav.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
    await expect(pageTitle(page, "Hello, World!")).toBeVisible();
  });

  test("the brand links home", async ({ page }) => {
    await page.goto("/resume");
    await brandLink(page).click();
    await expect(page).toHaveURL("/");
  });

  // visual.spec.ts screenshots content scrolled under the header to see the
  // blur itself.
  test("header has a backdrop filter", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner")).not.toHaveCSS(
      "backdrop-filter",
      "none"
    );
  });

  test("the theme choice persists across a reload", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    await themeOption(page, "Dark").click();
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await expect(themeOption(page, "Dark")).toBeChecked();
  });

  test("the footer sits below the content", async ({ page }) => {
    await page.goto("/resume");
    const footer = page.getByRole("contentinfo");

    const mainBox = (await page.getByRole("main").boundingBox())!;
    const footerBox = (await footer.boundingBox())!;
    expect(footerBox.y).toBeGreaterThanOrEqual(mainBox.y + mainBox.height);

    await expect(footer.getByRole("link", { name: "LinkedIn" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "GitHub" })).toBeVisible();
  });

  test("project search filters results", async ({ page }) => {
    await page.goto("/work");
    const results = page.locator(".work-page__results-display__result");
    const search = page.getByPlaceholder("Search projects");

    await expect(results).toHaveCount(PROJECT_COUNT);

    await search.fill("signalr");
    await expect(results).toHaveCount(1);
    await expect(results).toHaveText("React UseSignalR");

    await search.fill("no such project");
    await expect(results).toHaveCount(0);

    await search.fill("");
    await expect(results).toHaveCount(PROJECT_COUNT);
  });

  test("project card opens and closes its details", async ({ page }) => {
    await page.goto("/work");
    const details = projectDetails(page);

    await page.getByText("Informed Voter").click();
    await expect(details).toBeVisible();
    await expect(details.getByRole("heading", { level: 3 })).toHaveText(
      "Informed Voter"
    );

    await details.getByText("x", { exact: true }).click();
    await expect(details).toBeHidden();
  });

  test("the 404 page isn't indexed, marks no nav link and links home", async ({
    page,
  }) => {
    await page.goto("/does-not-exist");
    await expect(page).toHaveURL("/does-not-exist");
    await expect(page.locator('head > meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex"
    );
    await expect(primaryNav(page).locator("[aria-current]")).toHaveCount(0);

    await page
      .getByRole("main")
      .getByRole("link", { name: "Go to the home page" })
      .click();
    await expect(page).toHaveURL("/");
    await expect(pageTitle(page, "Hello, World!")).toBeVisible();
  });

  test("/contact shows the 404 page until R9", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveURL("/contact");
    await expect(pageTitle(page, "Page not found")).toBeVisible();
  });
});

test.describe("résumé", () => {
  test.use({ viewport: VIEWPORTS.desktop });

  test("experience is a timeline with highlights", async ({ page }) => {
    await page.goto("/resume");
    const entries = timelineEntries(resumeSection(page, "Experience"));

    await expect(entries.getByRole("heading", { level: 3 })).toHaveText([
      "Senior Software Engineer",
      "Software Engineer II",
      "Software Engineer",
    ]);

    const latest = entries.first();
    await expect(latest).toContainText("Biomeme Inc.");
    await expect(latest).toContainText("September 2021 – Present");
    await expect(latest.getByRole("listitem")).toHaveCount(4);
    await expect(latest.getByRole("listitem").nth(2)).toHaveText(
      "Piloted several core React, C# and Node.JS libraries which are used organization wide."
    );
    await expect(entries.nth(1).getByRole("listitem")).toHaveCount(1);
    await expect(entries.nth(2).getByRole("listitem")).toHaveCount(3);

    // The dates come after the title in the markup but show above it.
    const dates = (await latest
      .getByText("September 2021 – Present")
      .boundingBox())!;
    const title = (await latest.getByRole("heading").boundingBox())!;
    expect(dates.y).toBeLessThan(title.y);
  });

  test("education is a timeline without highlights", async ({ page }) => {
    await page.goto("/resume");
    const entries = timelineEntries(resumeSection(page, "Education"));

    await expect(entries.getByRole("heading", { level: 3 })).toHaveText([
      "BS Computer Science",
      "Certificate",
    ]);
    await expect(entries.first()).toContainText("Rutgers University");
    await expect(entries.getByRole("list")).toHaveCount(0);
  });

  test("skills are grouped by category", async ({ page }) => {
    await page.goto("/resume");
    const skills = resumeSection(page, "Skills");
    const groups = skills.locator(".resume-page__skill-group");

    await expect(skills.getByRole("heading", { level: 3 })).toHaveText([
      "Languages",
      "Frameworks & libraries",
      "Cloud & infra",
      "Testing & tooling",
    ]);
    for (const [index, count] of [11, 9, 7, 7].entries()) {
      await expect(groups.nth(index).getByRole("listitem")).toHaveCount(count);
    }
    await expect(skills.getByRole("listitem")).toHaveCount(34);
    await expect(groups.first().getByRole("listitem").first()).toHaveText(
      "TypeScript"
    );
  });

  test("links to the PDF", async ({ page }) => {
    await page.goto("/resume");
    await expect(
      page.getByRole("main").getByRole("link", { name: "Download PDF" })
    ).toHaveAttribute("href", RESUME_PDF_URL);
  });

  test.describe("printed", () => {
    // Dark, to check printing doesn't follow the theme.
    test.use({ colorScheme: "dark" });

    test("shows only the content, black on white", async ({ page }) => {
      await page.emulateMedia({ media: "print" });
      await page.goto("/resume");
      await expect(pageTitle(page, "Résumé")).toBeVisible();

      await expect(page.getByRole("banner")).toBeHidden();
      await expect(page.getByRole("contentinfo")).toBeHidden();
      await expect(
        page.getByRole("link", { name: "Skip to content" })
      ).toBeHidden();
      await expect(
        page.getByRole("link", { name: "Download PDF" })
      ).toBeHidden();

      await expect(page.locator("body")).toHaveCSS("background-color", WHITE);
      await expect(pageTitle(page, "Résumé")).toHaveCSS("color", BLACK);
      const entry = timelineEntries(resumeSection(page, "Experience")).first();
      await expect(entry.getByRole("heading")).toHaveCSS("color", BLACK);
      await expect(entry.getByText("Biomeme Inc.")).toHaveCSS("color", BLACK);
      await expect(entry).toHaveCSS("break-inside", "avoid");
      await expect(page.locator(".tag").first()).toHaveCSS(
        "background-color",
        TRANSPARENT
      );
    });
  });
});

test.describe("mobile", () => {
  test.use({ viewport: VIEWPORTS.mobile });

  test("menu closes on back/forward navigation", async ({ page }) => {
    const nav = primaryNav(page);
    await page.goto("/");
    await menuButton(page).click();
    await nav.getByRole("link", { name: "Résumé" }).click();
    await expect(page).toHaveURL("/resume");

    // An in-app history navigation with the menu open.
    await menuButton(page).click();
    await expect(nav).toBeVisible();
    await page.goBack();

    await expect(page).toHaveURL("/");
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
    await expect(nav).toBeHidden();
  });

  test("the page doesn't scroll while the menu is open", async ({ page }) => {
    await page.goto("/resume");
    const html = page.locator("html");

    await menuButton(page).click();
    await expect(html).toHaveCSS("overflow", "hidden");

    await menuButton(page).click();
    await expect(html).not.toHaveCSS("overflow", "hidden");
  });
});

test.describe("320px wide", () => {
  test.use({ viewport: NARROWEST_VIEWPORT });

  // visual.spec.ts checks the desktop and mobile viewports.
  test("no page scrolls sideways", async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route.path);
      await expect(pageTitle(page, route.title)).toBeVisible();
      await expectNoHorizontalScroll(page);
    }
  });
});
