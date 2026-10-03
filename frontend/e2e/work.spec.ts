import type { Page } from "@playwright/test";

import { toDocumentTitle } from "../src/common/utils/documentTitle";
import {
  expect,
  pageTitle,
  projectCardLink,
  projectCards,
  projectDialog,
  test,
  VIEWPORTS,
} from "./helpers";

const PROJECT_COUNT = 5;
const PROJECTS_TITLE = "Recent Personal Projects";

const searchBox = (page: Page) =>
  page.getByRole("searchbox", { name: "Search projects" });

const tagChip = (page: Page, tag: string) =>
  page
    .getByRole("group", { name: "Filter by tag" })
    .getByRole("button", { name: tag, exact: true });

/** Whether focus is inside the first element matching `selector`. */
const containsFocus = (page: Page, selector: string) =>
  page.evaluate(
    (selector) =>
      document.querySelector(selector)?.contains(document.activeElement) ??
      false,
    selector
  );

test.use({ viewport: VIEWPORTS.desktop });

test("search filters the projects and is kept in the URL", async ({ page }) => {
  await page.goto("/work");
  const cards = projectCards(page);
  await expect(cards).toHaveCount(PROJECT_COUNT);

  await searchBox(page).fill("signalr");
  await expect(cards).toHaveCount(1);
  await expect(cards.getByRole("heading")).toHaveText("React UseSignalR");
  await expect(page).toHaveURL("/work?q=signalr");
  await expect(page.getByRole("status")).toHaveText("1 of 5 projects");

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

test("filters load from the URL", async ({ page }) => {
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
});

test("no matches show an empty state that clears the filters", async ({
  page,
}) => {
  await page.goto("/work?q=no+such+project&tag=Python");
  await expect(projectCards(page)).toHaveCount(0);
  await expect(
    page.getByText("No projects match these filters.")
  ).toBeVisible();

  await page.getByRole("button", { name: "Clear filters" }).click();

  await expect(projectCards(page)).toHaveCount(PROJECT_COUNT);
  await expect(page).toHaveURL("/work");
  await expect(searchBox(page)).toHaveValue("");
  await expect(searchBox(page)).toBeFocused();
  await expect(tagChip(page, "Python")).toHaveAttribute(
    "aria-pressed",
    "false"
  );
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
  await expect.poll(() => containsFocus(page, "dialog")).toBe(true);
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
  await expect(page).toHaveURL("about:blank");
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

test("an unknown project shows the 404 page", async ({ page }) => {
  await page.goto("/work/no-such-project");
  await expect(pageTitle(page, "Page not found")).toBeVisible();
  await expect(page).toHaveTitle(toDocumentTitle("Page not found"));
  await expect(projectDialog(page)).toHaveCount(0);
});
