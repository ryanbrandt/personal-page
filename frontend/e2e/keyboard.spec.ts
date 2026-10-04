import {
  brandLink,
  expect,
  HOME_HEADING,
  menuButton,
  pageTitle,
  primaryNav,
  test,
  themeOption,
  VIEWPORTS,
} from "./helpers";

// A keyboard-only walk through the app shell: no clicks anywhere.

test.describe("desktop", () => {
  // A light OS: the theme toggle's checked option is Light until chosen.
  test.use({ viewport: VIEWPORTS.desktop, colorScheme: "light" });

  test("the skip link moves focus to the main content", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeAttached();

    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
  });

  test("Tab reaches the brand, the nav links and the theme toggle", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const nav = primaryNav(page);
    await expect(nav).toBeVisible();

    // The skip link is the first stop.
    await page.keyboard.press("Tab");
    for (const link of [
      brandLink(page),
      nav.getByRole("link", { name: "Home" }),
      nav.getByRole("link", { name: "Résumé" }),
      nav.getByRole("link", { name: "Projects" }),
      nav.getByRole("link", { name: "Contact" }),
    ]) {
      await page.keyboard.press("Tab");
      await expect(link).toBeFocused();
    }

    // The toggle is one tab stop, on the checked option (the light OS's
    // theme until the user chooses); arrows choose.
    await page.keyboard.press("Tab");
    await expect(themeOption(page, "Light")).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(themeOption(page, "Dark")).toBeChecked();
    await page.keyboard.press("ArrowLeft");
    await expect(themeOption(page, "Light")).toBeChecked();
    await expect(themeOption(page, "Light")).toBeFocused();
  });

  test("navigating moves focus to the new page's heading", async ({ page }) => {
    await page.goto("/");
    // The first load leaves focus alone.
    await expect(pageTitle(page, HOME_HEADING)).not.toBeFocused();

    await primaryNav(page).getByRole("link", { name: "Résumé" }).focus();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL("/resume");
    await expect(pageTitle(page, "Résumé")).toBeFocused();

    // The home page renders its own heading (the hero), not PageContainer's.
    await primaryNav(page).getByRole("link", { name: "Home" }).focus();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL("/");
    await expect(pageTitle(page, HOME_HEADING)).toBeFocused();
  });

  // Same-page navigation must not remount the header, which would drop
  // focus to <body>.
  test("a link to the current page keeps its focus", async ({ page }) => {
    await page.goto("/");

    await brandLink(page).focus();
    await page.keyboard.press("Enter");
    await expect(brandLink(page)).toBeFocused();

    const homeLink = primaryNav(page).getByRole("link", { name: "Home" });
    await homeLink.focus();
    await page.keyboard.press("Enter");
    await expect(homeLink).toBeFocused();
  });
});

test.describe("mobile", () => {
  test.use({ viewport: VIEWPORTS.mobile });

  test("the menu opens from the keyboard and Esc closes it", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = primaryNav(page);

    await menuButton(page).focus();
    await page.keyboard.press("Enter");
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "Home" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(nav).toBeHidden();
    await expect(menuButton(page)).toBeFocused();

    // Choosing a link closes the menu and focuses the new page's heading.
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name: "Résumé" })).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL("/resume");
    await expect(nav).toBeHidden();
    await expect(pageTitle(page, "Résumé")).toBeFocused();
  });
});
