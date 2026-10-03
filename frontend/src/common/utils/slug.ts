/**
 * A URL-safe slug: lower case ASCII letters and digits, with a hyphen
 * between words. It depends only on `text`, so it stays the same as long as
 * the text does, e.g. "React UseSignalR" → "react-usesignalr".
 */
export const toSlug = (text: string): string =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
