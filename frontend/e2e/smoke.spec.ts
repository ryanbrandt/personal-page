import {
  brandLink,
  expect,
  expectNoHorizontalScroll,
  menuButton,
  NARROWEST_VIEWPORT,
  pageTitle,
  primaryNav,
  ROUTES,
  test,
  themeOption,
  VIEWPORTS,
} from "./helpers";

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
