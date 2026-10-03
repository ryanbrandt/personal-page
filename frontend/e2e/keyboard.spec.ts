import { expect, test } from "@playwright/test";

import { menuButton, pageTitle, primaryNav, VIEWPORTS } from "./helpers";

// A keyboard-only walk through the app shell: no clicks anywhere.

test.describe("desktop", () => {
  test.use({ viewport: VIEWPORTS.desktop });

  test("the skip link moves focus to the main content", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: "Skip to content" });

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
    const html = page.locator("html");

    // The skip link is the first stop.
    await page.keyboard.press("Tab");
    for (const link of [
      page.getByRole("link", { name: "Ryan Brandt" }),
      nav.getByRole("link", { name: "Home" }),
      nav.getByRole("link", { name: "Résumé" }),
      nav.getByRole("link", { name: "Projects" }),
    ]) {
      await page.keyboard.press("Tab");
      await expect(link).toBeFocused();
    }

    // The toggle is one tab stop, on the checked option; arrows choose.
    await page.keyboard.press("Tab");
    await expect(page.getByRole("radio", { name: "System" })).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("radio", { name: "Light" })).toBeChecked();
    await expect(html).toHaveAttribute("data-theme", "light");
  });

  test("navigating moves focus to the new page's heading", async ({ page }) => {
    await page.goto("/");
    // The first load leaves focus alone.
    await expect(pageTitle(page, "Hello, World!")).not.toBeFocused();

    const resumeLink = primaryNav(page).getByRole("link", { name: "Résumé" });
    await resumeLink.focus();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL("/resume");
    await expect(pageTitle(page, "Résumé")).toBeFocused();
  });
});

test.describe("mobile", () => {
  test.use({ viewport: VIEWPORTS.mobile });

  test("the menu opens from the keyboard and Esc closes it", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = primaryNav(page);

    // Skip link, brand, the theme toggle, then the menu button.
    for (let stop = 0; stop < 4; stop++) await page.keyboard.press("Tab");
    await expect(menuButton(page)).toBeFocused();

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
