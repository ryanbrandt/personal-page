import { CONTACT_FIELDS } from "@app/Contact/constants";
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
    const value = data.get(field);
    const error = validateContactField(
      field,
      typeof value === "string" ? value : ""
    );
    if (error) errors[field] = error;
  }
  return errors;
};

/**
 * Sends the form to Netlify Forms, which takes a urlencoded POST to any
 * path on the site; the data must include the form's name (`form-name`).
 * Resolves to whether Netlify accepted it.
 */
export const postContactForm = async (data: FormData): Promise<boolean> => {
  const body = new URLSearchParams();
  for (const [field, value] of data) {
    // The form has no file inputs, so every value is a string.
    if (typeof value === "string") body.append(field, value);
  }
  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    return response.ok;
  } catch {
    return false;
  }
};
