import type { Page } from "@playwright/test";

import { toDocumentTitle } from "../src/common/utils/documentTitle";
import { WORK_ENTRIES } from "../src/repositories/work";
import { SEARCH_DEBOUNCE_MS } from "../src/Work/constants";
import {
  expect,
  pageTitle,
  projectCardLink,
  projectCards,
  projectDialog,
  ROUTES,
  test,
  VIEWPORTS,
} from "./helpers";

// Project images come from the `remoteImages` fixture in helpers.ts, which
// every test using its `test` gets: no network.

const PROJECT_COUNT = WORK_ENTRIES.length;
const PROJECTS_TITLE = ROUTES.find(({ name }) => name === "work")!.title;

const searchBox = (page: Page) =>
  page.getByRole("searchbox", { name: "Search projects" });

const tagChip = (page: Page, tag: string) =>
  page
    .getByRole("group", { name: "Filter by tag" })
    .getByRole("button", { name: tag, exact: true });

test.use({ viewport: VIEWPORTS.desktop });

test("search filters the projects and is kept in the URL", async ({ page }) => {
  await page.goto("/work");
  const cards = projectCards(page);
  await expect(cards).toHaveCount(PROJECT_COUNT);

  await searchBox(page).fill("signalr");
  await expect(cards).toHaveCount(1);
  await expect(cards.getByRole("heading")).toHaveText("React UseSignalR");
  await expect(page).toHaveURL("/work?q=signalr");
  await expect(page.getByRole("status")).toHaveText(
    `1 of ${PROJECT_COUNT} projects`
  );

  await searchBox(page).fill("");
  await expect(cards).toHaveCount(PROJECT_COUNT);
  await expect(page).toHaveURL("/work");
});

test("tag chips toggle and filter the projects", async ({ page }) => {
  await page.goto("/work");
  const cards = projectCards(page);
  const library = tagChip(page, "Library");
  const python = tagChip(page, "Python");

  await expect(library).toHaveAttribute("aria-pressed", "false");
  await library.click();
  await expect(library).toHaveAttribute("aria-pressed", "true");
  await expect(cards).toHaveCount(1);
  await expect(cards.getByRole("heading")).toHaveText("React Drag Selection");
  await expect(page).toHaveURL("/work?tag=Library");

  // Chosen tags widen the list: a project with any of them matches.
  await python.click();
  await expect(cards).toHaveCount(2);
  await expect(page).toHaveURL("/work?tag=Library&tag=Python");

  await library.click();
  await python.click();
  await expect(library).toHaveAttribute("aria-pressed", "false");
  await expect(cards).toHaveCount(PROJECT_COUNT);
  await expect(page).toHaveURL("/work");
});

test("filters load from the URL; no matches show an empty state that clears them", async ({
  page,
}) => {
  await page.goto("/work?q=drag&tag=React");
  await expect(searchBox(page)).toHaveValue("drag");
  await expect(tagChip(page, "React")).toHaveAttribute("aria-pressed", "true");
  await expect(tagChip(page, "Library")).toHaveAttribute(
    "aria-pressed",
    "false"
  );
  await expect(projectCards(page)).toHaveCount(1);
  await expect(projectCards(page).getByRole("heading")).toHaveText(
    "React Drag Selection"
  );

  await searchBox(page).fill("no such project");
  await expect(projectCards(page)).toHaveCount(0);
  await expect(
    page.getByText("No projects match these filters.")
  ).toBeVisible();

  await page.getByRole("button", { name: "Clear filters" }).click();

  await expect(projectCards(page)).toHaveCount(PROJECT_COUNT);
  await expect(page).toHaveURL("/work");
  await expect(searchBox(page)).toHaveValue("");
  await expect(searchBox(page)).toBeFocused();
  await expect(tagChip(page, "React")).toHaveAttribute("aria-pressed", "false");
});

test("a card opens its dialog; Esc closes it and refocuses the card", async ({
  page,
}) => {
  await page.goto("/work?tag=React");
  const card = projectCardLink(page, "Informed Voter");
  const dialog = projectDialog(page);

  await card.focus();
  await page.keyboard.press("Enter");

  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName("Informed Voter");
  await expect(page).toHaveURL("/work/informed-voter?tag=React");
  await expect(page).toHaveTitle(toDocumentTitle("Informed Voter"));
  await expect(dialog.locator(":focus")).toHaveCount(1);
  // A new path in the same route: the page stays and the heading isn't
  // focused behind the dialog.
  await expect(pageTitle(page, PROJECTS_TITLE)).not.toBeFocused();

  await page.keyboard.press("Escape");

  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL("/work?tag=React");
  await expect(page).toHaveTitle(toDocumentTitle("Projects"));
  await expect(card).toBeFocused();
});

test("a click on a card opens its dialog; the close button closes it", async ({
  page,
}) => {
  await page.goto("/");
  await page.goto("/work");
  const card = projectCardLink(page, "React UseSignalR");
  const dialog = projectDialog(page);

  await card.click();
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL("/work/react-usesignalr");

  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL("/work");
  await expect(card).toBeFocused();

  // Closing went back in history, so Back leaves the page.
  await page.goBack();
  await expect(page).toHaveURL("/");
});

test("a deep link opens the dialog over the grid", async ({ page }) => {
  await page.goto("/work/react-drag-selection?q=react");
  const dialog = projectDialog(page);

  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName("React Drag Selection");
  await expect(page).toHaveTitle(toDocumentTitle("React Drag Selection"));
  await expect(
    dialog.getByRole("link", { name: "View on GitHub: React Drag Selection" })
  ).toHaveAttribute(
    "href",
    "https://github.com/ryanbrandt/react-drag-selection"
  );
  await expect(pageTitle(page, PROJECTS_TITLE)).toBeAttached();
  await expect(projectCards(page)).toHaveCount(4);

  await dialog.getByRole("button", { name: "Close" }).click();

  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL("/work?q=react");
  await expect(searchBox(page)).toHaveValue("react");
  // No card opened it, so focus goes to the project's card.
  await expect(projectCardLink(page, "React Drag Selection")).toBeFocused();
});

test("a deep link whose project the filters hide focuses the heading on close", async ({
  page,
}) => {
  await page.goto("/work/open-fec-graphql-server?tag=React");
  const dialog = projectDialog(page);
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");

  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL("/work?tag=React");
  await expect(pageTitle(page, PROJECTS_TITLE)).toBeFocused();
});

// The page's timers wait for the test's clock, so the clicks always land
// before the debounced search is applied.
test("a chip clicked right after typing keeps both filters", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/work");

  await searchBox(page).fill("react");
  await tagChip(page, "Library").click();
  await tagChip(page, "Testing").click();
  await expect(page).toHaveURL("/work?tag=Library&tag=Testing");
  await page.clock.runFor(SEARCH_DEBOUNCE_MS);

  await expect(page).toHaveURL("/work?tag=Library&tag=Testing&q=react");
  await expect(tagChip(page, "Library")).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(tagChip(page, "Testing")).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(searchBox(page)).toHaveValue("react");
  await expect(projectCards(page)).toHaveCount(2);
});

test("a card clicked right after typing keeps its dialog and the search", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/work");
  const dialog = projectDialog(page);

  await searchBox(page).fill("voter");
  await projectCardLink(page, "Informed Voter").click();
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL("/work/informed-voter");
  await page.clock.runFor(SEARCH_DEBOUNCE_MS);

  // The search applies under the dialog, which stays open.
  await expect(page).toHaveURL("/work/informed-voter?q=voter");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName("Informed Voter");

  // Closing keeps the search the card's page didn't have yet.
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL("/work?q=voter");
  await expect(searchBox(page)).toHaveValue("voter");
  await expect(projectCardLink(page, "Informed Voter")).toBeFocused();
});

test("Back after a reload closes the dialog and focuses the card", async ({
  page,
}) => {
  await page.goto("/work");
  await projectCardLink(page, "Informed Voter").click();
  await expect(projectDialog(page)).toBeVisible();

  await page.reload();
  await expect(projectDialog(page)).toBeVisible();
  await page.goBack();

  await expect(page).toHaveURL("/work");
  await expect(projectDialog(page)).toBeHidden();
  await expect(projectCardLink(page, "Informed Voter")).toBeFocused();
});

test("a modified click on a card leaves it to the browser", async ({
  page,
}) => {
  await page.goto("/work");
  // Runs after the app's handler: records whether the app took the click,
  // then stops the browser opening a new tab, which the test doesn't need.
  await page.evaluate(() => {
    window.addEventListener("click", (event) => {
      document.body.dataset.appTookClick = String(event.defaultPrevented);
      event.preventDefault();
    });
  });

  await projectCardLink(page, "Informed Voter").click({
    modifiers: ["ControlOrMeta"],
  });

  await expect(page.locator("body")).toHaveAttribute(
    "data-app-took-click",
    "false"
  );
  await expect(page).toHaveURL("/work");
  await expect(projectDialog(page)).toBeHidden();
});

test("project slugs are unique and not empty", () => {
  const slugs = WORK_ENTRIES.map(({ slug }) => slug);
  expect(slugs.every((slug) => slug.length > 0)).toBe(true);
  expect(new Set(slugs).size).toBe(slugs.length);
});

test("an in-app link to an unknown project focuses the 404 heading", async ({
  page,
}) => {
  await page.goto("/work");
  // No link in the app leads there, so navigate the way a router link does.
  await page.evaluate(() => {
    history.pushState(null, "", "/work/no-such-project");
    dispatchEvent(new PopStateEvent("popstate"));
  });

  await expect(pageTitle(page, "Page not found")).toBeFocused();
});

test("an unknown project shows the 404 page", async ({ page }) => {
  await page.goto("/work/no-such-project");
  await expect(pageTitle(page, "Page not found")).toBeVisible();
  await expect(page).toHaveTitle(toDocumentTitle("Page not found"));
  await expect(projectDialog(page)).toHaveCount(0);
});
