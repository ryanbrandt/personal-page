import type { ContentSource } from "@app/content/ContentSource";
import { staticContentSource } from "@app/content/StaticContentSource";

/** The app's content: swap in an API-backed ContentSource here. */
export const contentSource: ContentSource = staticContentSource;
