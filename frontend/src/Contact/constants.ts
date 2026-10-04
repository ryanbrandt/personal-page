/**
 * The contact form's name in Netlify Forms. public/__forms.html declares the
 * form under this name, with these fields, for Netlify to detect at deploy
 * time; keep the two in step.
 */
export const CONTACT_FORM_NAME = "contact";

/** The field Netlify Forms reads the form's name from */
export const FORM_NAME_FIELD = "form-name";

/**
 * The honeypot: hidden from people, so only a bot fills it in, and Netlify
 * drops any submission that has it filled.
 */
export const HONEYPOT_FIELD = "bot-field";

/** The fields a person fills in, in the form's order */
export const CONTACT_FIELDS = ["name", "email", "message"] as const;
