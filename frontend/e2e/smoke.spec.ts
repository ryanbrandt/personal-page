import { expect, test } from "@playwright/test";

import {
  gotoAndSettle,
  mobileMenuBurger,
  openMobileMenu,
  pageTitle,
  projectDetails,
  ROUTES,
  VIEWPORTS,
} from "./helpers";

const PROJECT_COUNT = 5;

test.describe("desktop", () => {
  test.use({ viewport: VIEWPORTS.desktop });

  for (const route of ROUTES) {
    test(`${route.path} renders its title`, async ({ page }) => {
      await page.goto(route.path);
      await expect(pageTitle(page, route.title)).toBeVisible();
    });
  }

  test("nav links navigate between routes", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator(".app-header__menu");

    await nav.getByText("Résumé").click();
    await expect(page).toHaveURL("/resume");
    await expect(pageTitle(page, "Résumé")).toBeVisible();

    await nav.getByText("Personal Projects").click();
    await expect(page).toHaveURL("/work");
    await expect(pageTitle(page, "Recent Personal Projects")).toBeVisible();

    await nav.getByText("Home").click();
    await expect(page).toHaveURL("/");
    await expect(pageTitle(page, "Hello, World!")).toBeVisible();
  });

  test("theme toggle flips the theme", async ({ page }) => {
    await gotoAndSettle(page, "/");
    const toggle = page.locator(".app-header__theme-toggle");

    await toggle.click();
    await expect(page.locator(".theme--dark")).toBeVisible();

    await toggle.click();
    await expect(page.locator(".theme--light")).toBeVisible();
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

  test("unknown route renders the app shell with no page content", async ({
    page,
  }) => {
    // Recorded as-is: there is no 404 page, the content area is just empty.
    await page.goto("/does-not-exist");
    await expect(page.locator(".app-header")).toBeVisible();
    await expect(page.locator(".app-footer")).toBeVisible();
    await expect(page.locator(".content-container")).toBeEmpty();
  });
});

test.describe("mobile", () => {
  test.use({ viewport: VIEWPORTS.mobile });

  test("burger menu opens, navigates and closes", async ({ page }) => {
    await page.goto("/");
    const overlay = page.locator(".app-header__mobile-menu__overlay");

    await expect(page.locator(".app-header__menu")).toBeHidden();

    await mobileMenuBurger(page).click();
    await expect(openMobileMenu(page)).toBeVisible();
    await overlay.getByText("x", { exact: true }).click();
    await expect(openMobileMenu(page)).toBeHidden();

    await mobileMenuBurger(page).click();
    await overlay.getByText("Résumé").click();
    await expect(page).toHaveURL("/resume");
    await expect(pageTitle(page, "Résumé")).toBeVisible();
    await expect(openMobileMenu(page)).toBeHidden();
  });
});
