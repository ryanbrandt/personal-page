import { expect, test } from "@playwright/test";

import {
  gotoAndSettle,
  menuButton,
  pageTitle,
  primaryNav,
  projectDetails,
  ROUTES,
  themeOption,
  VIEWPORTS,
} from "./helpers";

const PROJECT_COUNT = 5;

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
    const current = primaryNav(page).locator('[aria-current="page"]');

    for (const [path, label] of [
      ["/", "Home"],
      ["/resume", "Résumé"],
      ["/resume/", "Résumé"],
      ["/work", "Projects"],
    ]) {
      await page.goto(path);
      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(label);
    }
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
    await page.getByRole("link", { name: "Ryan Brandt" }).click();
    await expect(page).toHaveURL("/");
  });

  // A CSS minifier change once dropped this blur silently; visual.spec.ts
  // also screenshots content scrolled under the header.
  test("header keeps its backdrop blur", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".navbar")).toHaveCSS(
      "backdrop-filter",
      "blur(8px)"
    );
  });

  test("theme toggle sets the theme and remembers it", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const html = page.locator("html");

    // No stored preference: follow the OS.
    await expect(html).toHaveAttribute("data-theme", "system");
    await expect(themeOption(page, "System")).toBeChecked();

    await themeOption(page, "Dark").click();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await expect(themeOption(page, "Dark")).toBeChecked();

    await themeOption(page, "Light").click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await themeOption(page, "System").click();
    await expect(html).toHaveAttribute("data-theme", "system");
  });

  test("the footer sits below the content, in flow", async ({ page }) => {
    await page.goto("/resume");
    const footer = page.getByRole("contentinfo");

    await expect(footer).toHaveCSS("position", "static");
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

  // /contact has no page until R9.
  for (const path of ["/does-not-exist", "/contact"]) {
    test(`${path} shows the 404 page`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(path);
      await expect(pageTitle(page, "Page not found")).toBeVisible();
      await expect(primaryNav(page).locator("[aria-current]")).toHaveCount(0);

      await page
        .getByRole("main")
        .getByRole("link", { name: "Go to the home page" })
        .click();
      await expect(page).toHaveURL("/");
      await expect(pageTitle(page, "Hello, World!")).toBeVisible();
    });
  }

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

  test("menu opens, navigates and closes", async ({ page }) => {
    await page.goto("/");
    const nav = primaryNav(page);

    await expect(nav).toBeHidden();

    await menuButton(page).click();
    await expect(nav).toBeVisible();
    await menuButton(page).click();
    await expect(nav).toBeHidden();

    await menuButton(page).click();
    await nav.getByRole("link", { name: "Résumé" }).click();
    await expect(page).toHaveURL("/resume");
    await expect(pageTitle(page, "Résumé")).toBeVisible();
    await expect(nav).toBeHidden();
  });

  test("menu closes on back/forward navigation", async ({ page }) => {
    await page.goto("/");
    await page.goto("/resume");

    await menuButton(page).click();
    await expect(primaryNav(page)).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL("/");
    await expect(primaryNav(page)).toBeHidden();
  });

  test("the page doesn't scroll while the menu is open", async ({ page }) => {
    await page.goto("/resume");
    const html = page.locator("html");

    await menuButton(page).click();
    await expect(html).toHaveCSS("overflow", "hidden");

    await menuButton(page).click();
    await expect(html).toHaveCSS("overflow", "visible");
  });
});
