import { expect, Page, test } from "@playwright/test";

import {
  COLOR_SCHEMES,
  gotoAndSettle,
  ROUTES,
  VIEWPORTS,
  waitForFontsAndImages,
} from "./helpers";

// The footer shows the current year, so it is masked in every screenshot.
const screenshotOptions = (page: Page) => ({
  fullPage: true,
  mask: [page.locator(".app-footer")],
});

for (const colorScheme of COLOR_SCHEMES) {
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    const variant = `${viewportName}-${colorScheme}`;

    test.describe(variant, () => {
      test.use({ viewport, colorScheme });

      for (const route of ROUTES) {
        test(route.name, async ({ page }) => {
          await gotoAndSettle(page, route.path);
          await expect(page).toHaveScreenshot(
            `${route.name}-${variant}.png`,
            screenshotOptions(page)
          );
        });
      }

      test("work modal open", async ({ page }) => {
        await gotoAndSettle(page, "/work");
        await page.getByText("Open FEC GraphQL Server").click();
        await expect(page.locator(".modal")).toBeVisible();
        await waitForFontsAndImages(page);
        await expect(page).toHaveScreenshot(
          `work-modal-open-${variant}.png`,
          screenshotOptions(page)
        );
      });

      if (viewportName === "mobile") {
        test("mobile menu open", async ({ page }) => {
          await gotoAndSettle(page, "/");
          await page.locator(".app-header__mobile-menu > svg").click();
          await expect(
            page.locator(".app-header__mobile-menu__overlay--open")
          ).toBeVisible();
          await expect(page).toHaveScreenshot(
            `mobile-menu-open-${variant}.png`,
            screenshotOptions(page)
          );
        });
      }
    });
  }
}
