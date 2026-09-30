import { expect, Page } from "@playwright/test";

export const ROUTES = [
  { name: "home", path: "/", title: "Hello, World!" },
  { name: "resume", path: "/resume", title: "Résumé" },
  { name: "work", path: "/work", title: "Recent Personal Projects" },
] as const;

// The app switches to its mobile layout at widths <= 1024px.
export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

export const COLOR_SCHEMES = ["light", "dark"] as const;

export const PROJECT_COUNT = 5;

/**
 * Navigates to `path` and waits until the page is visually settled:
 * the theme from `prefers-color-scheme` is applied (it is set in an effect
 * after the first render), web fonts are loaded and all images have decoded.
 */
export async function gotoAndSettle(page: Page, path: string): Promise<void> {
  await page.goto(path);
  const scheme = await page.evaluate(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  await expect(page.locator(`.theme--${scheme}`)).toBeVisible();
  await waitForFontsAndImages(page);
}

export async function waitForFontsAndImages(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() =>
    Array.from(document.images).every((img) => img.complete)
  );
}
