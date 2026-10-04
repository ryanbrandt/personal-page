import type { Page, Route } from "@playwright/test";

import {
  CONTACT_FIELDS,
  CONTACT_FORM_NAME,
  CONTACT_FORM_PATH,
  FORM_NAME_FIELD,
  HONEYPOT_FIELD,
} from "../src/Contact/constants";

import {
  expect,
  expectNoBlockingAxeViolations,
  ROUTES,
  test,
  VIEWPORTS,
} from "./helpers";

const CONTACT_ROUTE = ROUTES.find(({ name }) => name === "contact")!;

const nameField = (page: Page) => page.getByLabel("Name", { exact: true });
const emailField = (page: Page) => page.getByLabel("Email", { exact: true });
const messageField = (page: Page) => page.getByLabel("How can I help you?");
const submitButton = (page: Page) =>
  page.getByRole("button", { name: "Submit" });
const sentMessage = (page: Page) =>
  page.getByText("Thanks for getting in touch! Your message was sent.");
const failedMessage = (page: Page) =>
  page.getByText("Sorry, your message couldn’t be sent. Please try again.");
const tryAgainButton = (page: Page) =>
  page.getByRole("button", { name: "Try again" });
/** The live region announcing whether the form was sent */
const outcome = (page: Page) => page.getByRole("status");

const VALID_ENTRY = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I'd like to talk about the Analytical Engine.",
};

async function fillForm(page: Page, entry = VALID_ENTRY): Promise<void> {
  await nameField(page).fill(entry.name);
  await emailField(page).fill(entry.email);
  await messageField(page).fill(entry.message);
}

interface Submission {
  method: string;
  contentType: string | null;
  body: URLSearchParams;
}

/**
 * Answers the requests to Netlify Forms with `handle`, and returns what
 * was sent: check it with expectFormPosts.
 */
async function interceptSubmissions(
  page: Page,
  handle: (route: Route) => Promise<void>
): Promise<Array<Submission>> {
  const submissions: Array<Submission> = [];
  await page.route(
    (url) => url.pathname === CONTACT_FORM_PATH,
    async (route) => {
      const request = route.request();
      submissions.push({
        method: request.method(),
        contentType: await request.headerValue("content-type"),
        body: new URLSearchParams(request.postData() ?? ""),
      });
      await handle(route);
    }
  );
  return submissions;
}

/** There were `count` submissions, each a urlencoded POST */
function expectFormPosts(
  submissions: ReadonlyArray<Submission>,
  count: number
): void {
  expect(submissions).toHaveLength(count);
  for (const { method, contentType } of submissions) {
    expect(method).toBe("POST");
    expect(contentType).toBe("application/x-www-form-urlencoded");
  }
}

const respondOk = (route: Route) => route.fulfill({ status: 200 });

test.use({ viewport: VIEWPORTS.desktop });

test.describe("the contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("an empty form shows each field's error and focuses the first", async ({
    page,
  }) => {
    await submitButton(page).click();

    await expect(nameField(page)).toBeFocused();
    for (const [field, error] of [
      [nameField(page), "Enter your name"],
      [emailField(page), "Enter your email address"],
      [messageField(page), "Enter a message"],
    ] as const) {
      await expect(field).toHaveAttribute("aria-invalid", "true");
      await expect(field).toHaveAccessibleDescription(error);
    }
    await expectNoBlockingAxeViolations(page, CONTACT_ROUTE, "desktop");
  });

  test("an invalid email is focused, and its error clears once fixed", async ({
    page,
  }) => {
    await fillForm(page, { ...VALID_ENTRY, email: "ada@example" });
    await submitButton(page).click();

    await expect(emailField(page)).toBeFocused();
    await expect(emailField(page)).toHaveAccessibleDescription(
      "Enter an email address like name@example.com"
    );
    await expect(nameField(page)).not.toHaveAttribute("aria-invalid");
    await expect(messageField(page)).not.toHaveAttribute("aria-invalid");

    await emailField(page).fill(VALID_ENTRY.email);
    await expect(emailField(page)).not.toHaveAttribute("aria-invalid");
    await expect(emailField(page)).toHaveAccessibleDescription("");
  });

  test("sends the form to Netlify, confirms and clears it", async ({
    page,
  }) => {
    let respond!: () => void;
    const responded = new Promise<void>((resolve) => (respond = resolve));
    const submissions = await interceptSubmissions(page, async (route) => {
      await responded;
      await respondOk(route);
    });

    await fillForm(page);
    await submitButton(page).click();

    // Sending: the button is disabled and says so, the fields can't be
    // edited (the reset would lose the edit), and Enter in a field
    // (implicit submission) can't send the form again.
    const sending = page.getByRole("button", { name: "Sending…" });
    await expect(sending).toBeDisabled();
    for (const field of [nameField, emailField, messageField]) {
      await expect(field(page)).not.toBeEditable();
    }
    await nameField(page).press("Enter");
    respond();

    await expect(outcome(page)).toBeFocused();
    await expect(outcome(page)).toHaveText(
      "Thanks for getting in touch! Your message was sent."
    );
    await expect(submitButton(page)).toBeEnabled();
    for (const field of [nameField, emailField, messageField]) {
      await expect(field(page)).toBeEditable();
      await expect(field(page)).toHaveValue("");
    }

    expectFormPosts(submissions, 1);
    expect(Object.fromEntries(submissions[0].body)).toEqual({
      [FORM_NAME_FIELD]: CONTACT_FORM_NAME,
      [HONEYPOT_FIELD]: "",
      ...VALID_ENTRY,
    });
  });

  test("an edit, or a submit with errors, clears the outcome", async ({
    page,
  }) => {
    await interceptSubmissions(page, respondOk);

    await fillForm(page);
    await submitButton(page).click();
    await expect(outcome(page)).toBeFocused();
    await expect(sentMessage(page)).toBeVisible();
    // The sent form is empty.
    await submitButton(page).click();
    await expect(nameField(page)).toBeFocused();
    await expect(outcome(page)).toBeEmpty();

    await fillForm(page);
    await submitButton(page).click();
    await expect(outcome(page)).toBeFocused();
    await expect(sentMessage(page)).toBeVisible();
    await nameField(page).pressSequentially("A");
    await expect(outcome(page)).toBeEmpty();
  });

  test.describe("when sending fails", () => {
    // The browser logs the failed request as a console error.
    test.use({
      allowedConsoleProblems:
        /^error: Failed to load resource: (the server responded with a status of 500\b|net::ERR_FAILED$)/,
    });

    test("says so, keeps the entry, and Try again resends it", async ({
      page,
    }) => {
      const statuses = [500, 200];
      const submissions = await interceptSubmissions(page, (route) =>
        route.fulfill({ status: statuses.shift() })
      );

      await fillForm(page);
      await submitButton(page).click();

      await expect(outcome(page)).toBeFocused();
      await expect(failedMessage(page)).toBeVisible();
      await expect(sentMessage(page)).toBeHidden();
      await expect(nameField(page)).toHaveValue(VALID_ENTRY.name);
      await expectNoBlockingAxeViolations(page, CONTACT_ROUTE, "desktop");

      // Try again is the next tab stop after the focused outcome.
      await page.keyboard.press("Tab");
      await expect(tryAgainButton(page)).toBeFocused();
      await page.keyboard.press("Enter");

      await expect(sentMessage(page)).toBeVisible();
      await expect(outcome(page)).toBeFocused();
      await expect(failedMessage(page)).toBeHidden();
      await expect(tryAgainButton(page)).toBeHidden();
      expectFormPosts(submissions, 2);
      expect(submissions[1].body.toString()).toBe(
        submissions[0].body.toString()
      );
    });

    test("says so when the network fails", async ({ page }) => {
      await interceptSubmissions(page, (route) => route.abort());

      await fillForm(page);
      await submitButton(page).click();

      await expect(outcome(page)).toBeFocused();
      await expect(failedMessage(page)).toBeVisible();
      await expect(nameField(page)).toHaveValue(VALID_ENTRY.name);
    });
  });

  test("the honeypot is in the form but hidden from people", async ({
    page,
  }) => {
    const honeypot = page.locator(`input[name="${HONEYPOT_FIELD}"]`);

    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toBeHidden();
  });
});

// Netlify finds forms in the deployed HTML, not in the app's JavaScript; the
// build writes this page from the app's constants (vite.config.ts).
test("the static form Netlify detects matches the app's", async ({ page }) => {
  await page.goto(CONTACT_FORM_PATH);
  const form = page.locator(`form[name="${CONTACT_FORM_NAME}"]`);

  await expect(form).toHaveAttribute("data-netlify", "true");
  await expect(form).toHaveAttribute("netlify-honeypot", HONEYPOT_FIELD);
  expect(
    await form
      .locator("[name]")
      .evaluateAll((fields) =>
        fields.map((field) => field.getAttribute("name"))
      )
      .then((names) => names.sort())
  ).toEqual([HONEYPOT_FIELD, ...CONTACT_FIELDS].sort());
});
