const SITE_NAME = "Ryan Brandt";

/**
 * The home page's browser tab title. index.html repeats it as the title
 * shown before the app loads.
 */
export const HOME_TITLE = `${SITE_NAME} | Software Engineer`;

/** The browser tab title of any other page: its name, then the site's. */
export const toDocumentTitle = (pageName: string): string =>
  `${pageName} | ${SITE_NAME}`;
