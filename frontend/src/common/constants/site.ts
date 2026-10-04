import { contentSource } from "@app/content/source";

/**
 * Whose site this is: the brand, the tab titles and the printed résumé.
 * The site's identity, so it's read once, up front (index.html repeats it).
 */
export const OWNER_NAME = contentSource.getProfile().name;
