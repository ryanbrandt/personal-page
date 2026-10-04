// The contact form in Netlify Forms. Netlify finds forms in the deployed
// HTML, not in the app's JavaScript, so the build writes a static copy of
// the form from these constants (netlifyForms in vite.config.ts).

/** The contact form's name in Netlify Forms */
export const CONTACT_FORM_NAME = "contact";

/**
 * The static page declaring the form, which the app also posts to: Netlify
 * takes a form's submissions at any path, and this one is always a static
 * file, whatever rewrites the site's other paths get.
 */
export const CONTACT_FORM_PATH = "/__forms.html";

/** The field Netlify Forms reads the form's name from */
export const FORM_NAME_FIELD = "form-name";

/**
 * The honeypot: hidden from people, so only a bot fills it in, and Netlify
 * drops any submission that has it filled.
 */
export const HONEYPOT_FIELD = "bot-field";

/** The fields a person fills in, in the form's order */
export const CONTACT_FIELDS = ["name", "email", "message"] as const;
