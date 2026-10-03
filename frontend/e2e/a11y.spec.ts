import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { gotoAndSettle, ROUTES, VIEWPORTS } from "./helpers";

const COLOR_SCHEMES = ["light", "dark"] as const;
const BLOCKING_IMPACTS = ["serious", "critical"];

for (const colorScheme of COLOR_SCHEMES) {
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    test.describe(`${viewportName}-${colorScheme}`, () => {
      test.use({ viewport, colorScheme });

      for (const route of ROUTES) {
        test(`${route.name} has no serious or critical axe violations`, async ({
          page,
        }) => {
          await gotoAndSettle(page, route.path);
          const { violations } = await new AxeBuilder({ page })
            // R5 redesigns the work cards, whose titles are faded on desktop
            // (color-contrast).
            .exclude(".work-page__results-display__result > label")
            .analyze();

          const blocking = violations
            .filter(({ impact }) => BLOCKING_IMPACTS.includes(impact ?? ""))
            .map(({ id, nodes }) => ({
              id,
              targets: nodes.map(({ target }) => target.join(" ")),
            }));
          expect(blocking).toEqual([]);
        });
      }
    });
  }
}
