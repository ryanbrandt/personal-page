import {
  countPdfPages,
  expect,
  expectNoBlockingAxeViolations,
  expectNoHorizontalScroll,
  gotoAndSettle,
  menuButton,
  primaryNav,
  PRINT_VIEWPORT,
  projectCardLink,
  projectDialog,
  ROUTES,
  test,
  type ViewportName,
  VIEWPORTS,
  waitForStableRender,
} from "./helpers";

const COLOR_SCHEMES = ["light", "dark"] as const;
const WORK_ROUTE = ROUTES.find(({ name }) => name === "work")!;

// Each route is screenshotted and checked with axe and for sideways scrolling
// in one page load, in every colour scheme and viewport.
for (const colorScheme of COLOR_SCHEMES) {
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS) as Array<
    [ViewportName, (typeof VIEWPORTS)[ViewportName]]
  >) {
    const variant = `${viewportName}-${colorScheme}`;

    test.describe(variant, () => {
      test.use({ viewport, colorScheme });

      for (const route of ROUTES) {
        test(route.name, async ({ page }) => {
          await gotoAndSettle(page, route.path);
          await expect(page).toHaveScreenshot(`${route.name}-${variant}.png`, {
            fullPage: true,
          });
          await expectNoBlockingAxeViolations(page, route, viewportName);
          await expectNoHorizontalScroll(page);
        });
      }

      test("work modal open", async ({ page }) => {
        await gotoAndSettle(page, "/work");
        await projectCardLink(page, "Open FEC GraphQL Server").click();
        await expect(projectDialog(page)).toBeVisible();
        await waitForStableRender(page);
        // The page can't scroll while the dialog is open, so the viewport is
        // all there is to see (a full-page capture shows the backdrop over
        // the first screen only).
        await expect(page).toHaveScreenshot(`work-modal-open-${variant}.png`);
        await expectNoBlockingAxeViolations(page, WORK_ROUTE, viewportName);
      });

      // Full-page captures never put content under the sticky header, so
      // they can't see its translucent, blurred background (a CSS minifier
      // change once dropped the blur silently).
      test("content scrolled under the header", async ({ page }) => {
        await gotoAndSettle(page, "/resume");
        await page.evaluate(() => window.scrollTo(0, 440));
        await waitForStableRender(page);
        await expect(page).toHaveScreenshot(`scrolled-resume-${variant}.png`);
      });
    });
  }

  test.describe(`mobile-menu-${colorScheme}`, () => {
    test.use({ viewport: VIEWPORTS.mobile, colorScheme });

    test("mobile menu open", async ({ page }) => {
      await gotoAndSettle(page, "/");
      await menuButton(page).click();
      await expect(primaryNav(page)).toBeVisible();
      await expect(page).toHaveScreenshot(
        `mobile-menu-open-mobile-${colorScheme}.png`,
        { fullPage: true }
      );
    });
  });
}

// Print ignores the theme, so the dark one shows it: black on white.
test.describe("print", () => {
  test.use({ viewport: PRINT_VIEWPORT, colorScheme: "dark" });

  test("résumé printed", async ({ page }) => {
    await page.emulateMedia({ media: "print" });
    await gotoAndSettle(page, "/resume");
    await expect(page).toHaveScreenshot("resume-print.png", { fullPage: true });

    // Experience fills the first page; education and skills the second.
    const pdf = await page.pdf({ format: "Letter" });
    expect(countPdfPages(pdf)).toBe(2);
  });
});
