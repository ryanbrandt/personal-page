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

  test("exactly the current route's nav link is marked current", async ({
    page,
  }) => {
    const current = page.locator('.app-header__menu [aria-current="page"]');

    for (const [path, label] of [
      ["/", "Home"],
      ["/resume", "Résumé"],
      ["/resume/", "Résumé"],
      ["/work", "Personal Projects"],
    ]) {
      await page.goto(path);
      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(label);
    }
  });

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

  // Screenshots can't see this blur (nothing scrolls under the fixed header),
  // and a CSS minifier change once dropped it silently.
  test("header keeps its backdrop blur", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".app-header")).toHaveCSS(
      "backdrop-filter",
      "blur(10px)"
    );
  });

  test("theme toggle flips the theme and remembers it", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.locator(".app-header__theme-toggle");

    // No stored preference: follow the OS, which Playwright reports as light.
    await expect(html).toHaveAttribute("data-theme", "system");

    await toggle.click();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "dark");

    await toggle.click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
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

  // Until R2 adds a 404 page (and R9 brings back /contact), these redirect
  // home instead of rendering an empty content area.
  for (const path of ["/does-not-exist", "/contact"]) {
    test(`${path} redirects home`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL("/");
      await expect(pageTitle(page, "Hello, World!")).toBeVisible();
    });
  }

  test("back after a redirect returns to the previous page", async ({
    page,
  }) => {
    await page.goto("/resume");
    await page.goto("/does-not-exist");
    await expect(page).toHaveURL("/");

    await page.goBack();
    await expect(page).toHaveURL("/resume");
  });

  test("nav links work from the keyboard", async ({ page }) => {
    await page.goto("/");
    const resumeLink = page
      .locator(".app-header__menu")
      .getByRole("link", { name: "Résumé" });

    // Home is the first tab stop, Résumé the second.
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(resumeLink).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/resume");
    await expect(pageTitle(page, "Résumé")).toBeVisible();
  });

  for (const route of ROUTES) {
    test(`${route.path} loads without console warnings or errors`, async ({
      page,
    }) => {
      const messages: Array<string> = [];
      page.on("console", (message) => {
        if (message.type() === "warning" || message.type() === "error") {
          messages.push(`${message.type()}: ${message.text()}`);
        }
      });
      page.on("pageerror", (error) => messages.push(`pageerror: ${error}`));

      await gotoAndSettle(page, route.path);
      expect(messages).toEqual([]);
    });
  }
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
