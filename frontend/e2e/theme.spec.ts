import { expect, test, type Page } from "@playwright/test";

import { THEME_STORAGE_KEY } from "../src/common/utils/theme";

type Scheme = "light" | "dark";

const storePreference = (page: Page, preference: string) =>
  page.addInitScript(
    ([key, value]) => localStorage.setItem(key, value),
    [THEME_STORAGE_KEY, preference]
  );

// These tests only need index.html and the stylesheet. Without the app bundle
// nothing but index.html's own script can theme the page, so what they see is
// what the first paint shows.
const blockScripts = (page: Page) =>
  page.route("**/*.js", (route) => route.abort());

/** The library's bg and text tokens for `scheme`, as computed colours. */
const tokenColors = (page: Page, scheme: Scheme) =>
  page.evaluate((scheme) => {
    const probe = document.createElement("div");
    probe.dataset.theme = scheme;
    probe.style.backgroundColor = "var(--rq-color-bg)";
    probe.style.color = "var(--rq-color-text)";
    document.body.append(probe);
    const { backgroundColor, color } = getComputedStyle(probe);
    probe.remove();
    return { background: backgroundColor, text: color };
  }, scheme);

/** The colours of the theme-color metas that currently apply. */
const activeThemeColors = (page: Page) =>
  page.evaluate(() => {
    const probe = document.createElement("div");
    document.body.append(probe);
    const colors = Array.from(
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    )
      .filter((meta) => window.matchMedia(meta.media).matches)
      .map((meta) => {
        probe.style.color = meta.content;
        return getComputedStyle(probe).color;
      });
    probe.remove();
    return colors;
  });

const expectScheme = async (page: Page, scheme: Scheme) => {
  const { background, text } = await tokenColors(page, scheme);
  const body = page.locator("body");
  await expect(body).toHaveCSS("background-color", background);
  await expect(body).toHaveCSS("color", text);
  await expect.poll(() => activeThemeColors(page)).toEqual([background]);
};

test("a stored preference is applied before the app loads", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await storePreference(page, "dark");
  await blockScripts(page);
  await page.goto("/");

  await expect(page.locator("#root")).toBeEmpty();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectScheme(page, "dark");
});

test('"system" (the default) follows the OS live', async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await blockScripts(page);
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "system");
  await expectScheme(page, "dark");

  await page.emulateMedia({ colorScheme: "light" });
  await expectScheme(page, "light");
});

test("an invalid stored value falls back to system", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await storePreference(page, "Dark");
  await blockScripts(page);
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "system");
  await expectScheme(page, "dark");
});

test("the toggle flips away from what the OS shows under system", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await page.locator(".app-header__theme-toggle").click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectScheme(page, "light");
});
