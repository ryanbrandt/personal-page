import type { CONTACT_FIELDS } from "@app/Contact/constants";

export type ContactField = (typeof CONTACT_FIELDS)[number];

/** Each invalid field's error message */
export type ContactFormErrors = Partial<Record<ContactField, string>>;

export type SubmitStatus = "idle" | "submitting" | "sent" | "failed";
