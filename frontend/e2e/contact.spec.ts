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

/**
 * Answers the form's POSTs to Netlify Forms with `handle`, and returns the
 * bodies posted.
 */
async function interceptSubmissions(
  page: Page,
  handle: (route: Route) => Promise<void>
): Promise<Array<URLSearchParams>> {
  const bodies: Array<URLSearchParams> = [];
  await page.route(
    (url) => url.pathname === CONTACT_FORM_PATH,
    async (route) => {
      const request = route.request();
      expect(request.method()).toBe("POST");
      expect(await request.headerValue("content-type")).toBe(
        "application/x-www-form-urlencoded"
      );
      bodies.push(new URLSearchParams(request.postData() ?? ""));
      await handle(route);
    }
  );
  return bodies;
}

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
    const bodies = await interceptSubmissions(page, async (route) => {
      await responded;
      await route.fulfill({ status: 200 });
    });

    await fillForm(page);
    await submitButton(page).click();

    // Sending: the button is disabled and says so, and Enter in a field
    // (implicit submission) can't send the form again.
    const sending = page.getByRole("button", { name: "Sending…" });
    await expect(sending).toBeDisabled();
    await nameField(page).press("Enter");
    respond();

    await expect(sentMessage(page)).toBeFocused();
    await expect(submitButton(page)).toBeEnabled();
    for (const field of [nameField, emailField, messageField]) {
      await expect(field(page)).toHaveValue("");
    }

    expect(bodies).toHaveLength(1);
    expect(Object.fromEntries(bodies[0])).toEqual({
      [FORM_NAME_FIELD]: CONTACT_FORM_NAME,
      [HONEYPOT_FIELD]: "",
      ...VALID_ENTRY,
    });
  });

  test.describe("when sending fails", () => {
    // The browser logs the failed request as a console error.
    test.use({
      allowedConsoleProblems: [
        /^error: Failed to load resource: the server responded with a status of 500\b/,
      ],
    });

    test("alerts, keeps the entry, and Try again resends it", async ({
      page,
    }) => {
      const statuses = [500, 200];
      const bodies = await interceptSubmissions(page, (route) =>
        route.fulfill({ status: statuses.shift() })
      );

      await fillForm(page);
      await submitButton(page).click();

      await expect(failedMessage(page)).toBeFocused();
      await expect(sentMessage(page)).toBeHidden();
      await expect(nameField(page)).toHaveValue(VALID_ENTRY.name);
      await expectNoBlockingAxeViolations(page, CONTACT_ROUTE, "desktop");

      await tryAgainButton(page).click();

      await expect(sentMessage(page)).toBeFocused();
      await expect(failedMessage(page)).toBeHidden();
      await expect(tryAgainButton(page)).toBeHidden();
      expect(bodies).toHaveLength(2);
      expect(bodies[1].toString()).toBe(bodies[0].toString());
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
