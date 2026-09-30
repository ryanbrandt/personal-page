import path from "node:path";

import { expect, Page } from "@playwright/test";

export const ROUTES = [
  { name: "home", path: "/", title: "Hello, World!" },
  { name: "resume", path: "/resume", title: "Résumé" },
  { name: "work", path: "/work", title: "Recent Personal Projects" },
] as const;

// The app switches to its mobile layout at widths <= MOBILE_WIDTH_UPPER_BOUND (1024px).
export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

export const pageTitle = (page: Page, title: string) =>
  page.getByRole("heading", { level: 2, name: title, exact: true });

export const projectDetails = (page: Page) =>
  page.locator(".work-page__results-display__result__details-overlay");

export const mobileMenuBurger = (page: Page) =>
  page.locator(".app-header__mobile-menu > svg");

export const openMobileMenu = (page: Page) =>
  page.locator(".app-header__mobile-menu__overlay--open");

const REMOTE_IMAGES = "https://resume-work-images.s3.amazonaws.com/**";
const FIXTURES_DIR = path.join(__dirname, "fixtures");

/** Serves project images from committed copies so S3 can't flake the suite. */
async function stubRemoteImages(page: Page): Promise<void> {
  await page.route(REMOTE_IMAGES, (route) => {
    const fileName = decodeURIComponent(
      new URL(route.request().url()).pathname.slice(1).replaceAll("+", " ")
    );
    return route.fulfill({ path: path.join(FIXTURES_DIR, fileName) });
  });
}

/**
 * Navigates to `path` and waits until the page is visually settled: the
 * clock is frozen (the footer shows the current year), remote images are
 * served locally, the theme from
 * `prefers-color-scheme` is applied (it is set in an effect after the first
 * render), web fonts are loaded and all images have decoded.
 */
export async function gotoAndSettle(page: Page, path: string): Promise<void> {
  await page.clock.setFixedTime(new Date("2026-01-01T12:00:00Z"));
  await stubRemoteImages(page);
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
