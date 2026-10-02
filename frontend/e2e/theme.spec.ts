import { expect, test, type Page } from "@playwright/test";

// The library's --rq-color-bg and --rq-color-text tokens.
const BODY_COLORS = {
  light: { background: "rgb(246, 247, 251)", text: "rgb(26, 28, 36)" },
  dark: { background: "rgb(18, 20, 27)", text: "rgb(236, 238, 244)" },
} as const;

const storePreference = (page: Page, preference: string) =>
  page.addInitScript((value) => {
    localStorage.setItem("theme", value);
  }, preference);

const expectBodyColors = async (page: Page, scheme: "light" | "dark") => {
  const body = page.locator("body");
  await expect(body).toHaveCSS(
    "background-color",
    BODY_COLORS[scheme].background
  );
  await expect(body).toHaveCSS("color", BODY_COLORS[scheme].text);
};

const themeColor = (page: Page) =>
  page.evaluate(() => {
    const active = Array.from(
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    ).filter((meta) => window.matchMedia(meta.media).matches);
    return active.map((meta) => meta.content);
  });

test.describe("stored dark preference under a light OS", () => {
  test.use({ colorScheme: "light" });

  test("the first paint is already dark", async ({ page }) => {
    await storePreference(page, "dark");
    // Without the app bundle nothing but index.html's inline script can theme
    // the page, so what shows here is what the first paint shows.
    await page.route("**/*.{js,tsx}", (route) => route.abort());

    await page.goto("/");

    await expect(page.locator("#root")).toBeEmpty();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expectBodyColors(page, "dark");
    expect(await themeColor(page)).toEqual(["#12141b"]);
  });
});

test.describe("stored light preference under a dark OS", () => {
  test.use({ colorScheme: "dark" });

  test("the stored preference wins over the OS", async ({ page }) => {
    await storePreference(page, "light");
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expectBodyColors(page, "light");
    expect(await themeColor(page)).toEqual(["#f6f7fb"]);
  });
});

test('"system" follows prefers-color-scheme', async ({ page }) => {
  await storePreference(page, "system");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "system");
  await expectBodyColors(page, "dark");
  expect(await themeColor(page)).toEqual(["#12141b"]);

  // An OS change applies straight away, with no reload.
  await page.emulateMedia({ colorScheme: "light" });
  await expectBodyColors(page, "light");
  expect(await themeColor(page)).toEqual(["#f6f7fb"]);
});

test("an invalid stored value falls back to the system theme", async ({
  page,
}) => {
  await storePreference(page, "Dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "system");
  await expectBodyColors(page, "dark");
});
