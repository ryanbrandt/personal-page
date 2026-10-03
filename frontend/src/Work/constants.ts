import { BASE_ROUTES } from "@app/routes/constants";

/** The URL query parameters of the project filters */
export const QUERY_PARAM = "q";
export const TAG_PARAM = "tag";

export const SEARCH_DEBOUNCE_MS = 250;

/** The path of a project's detail view */
export const toWorkEntryPath = (slug: string): string =>
  `${BASE_ROUTES.work}/${slug}`;

/**
 * The history state of a detail view opened from a project card: closing it
 * goes back to the page the card was on.
 */
export const OPENED_FROM_CARD_STATE = { openedFromCard: true } as const;

/** Whether a location's `state` is OPENED_FROM_CARD_STATE (a copy of it). */
export const isOpenedFromCard = (state: unknown): boolean =>
  (state as Partial<typeof OPENED_FROM_CARD_STATE> | null)?.openedFromCard ===
  true;
