import { OWNER_NAME } from "@app/common/constants/site";

/** The browser tab title of any other page: its name, then the site's. */
export const toDocumentTitle = (pageName: string): string =>
  `${pageName} | ${OWNER_NAME}`;
