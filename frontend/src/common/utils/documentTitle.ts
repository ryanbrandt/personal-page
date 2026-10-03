import { OWNER_NAME } from "@app/common/constants/site";

/**
 * The home page's browser tab title. index.html repeats it as the title
 * shown before the app loads.
 */
export const HOME_TITLE = `${OWNER_NAME} | Software Engineer`;

/** The browser tab title of any other page: its name, then the site's. */
export const toDocumentTitle = (pageName: string): string =>
  `${pageName} | ${OWNER_NAME}`;
