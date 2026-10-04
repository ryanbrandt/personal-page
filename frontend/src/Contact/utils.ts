import { CONTACT_FIELDS, CONTACT_FORM_PATH } from "@app/Contact/constants";
import type { ContactField, ContactFormErrors } from "@app/Contact/types";

// Something@something.something, with no spaces: enough to catch typos,
// without rejecting unusual but valid addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_MESSAGES: Record<ContactField, string> = {
  name: "Enter your name",
  email: "Enter your email address",
  message: "Enter a message",
};

/** The error message for a field's value, if it isn't valid */
export const validateContactField = (
  field: ContactField,
  value: string
): string | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return REQUIRED_MESSAGES[field];
  if (field === "email" && !EMAIL_PATTERN.test(trimmed)) {
    return "Enter an email address like name@example.com";
  }
  return undefined;
};

/** The error messages of the form's invalid fields */
export const validateContactForm = (data: FormData): ContactFormErrors => {
  const errors: ContactFormErrors = {};
  for (const field of CONTACT_FIELDS) {
    // The form has no file inputs, so every value is a string.
    const value = (data.get(field) as string | null) ?? "";
    const error = validateContactField(field, value);
    if (error) errors[field] = error;
  }
  return errors;
};

/**
 * Sends the form to Netlify Forms as a urlencoded POST to the page that
 * declares it; the data must include the form's name (`form-name`).
 * Resolves to whether Netlify accepted it.
 */
export const postContactForm = async (data: FormData): Promise<boolean> => {
  // As above, every value is a string.
  const body = new URLSearchParams(Array.from(data) as Array<[string, string]>);
  try {
    const response = await fetch(CONTACT_FORM_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    return response.ok;
  } catch {
    return false;
  }
};
