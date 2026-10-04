import { BASE_ROUTES } from "@app/routes/constants";

/** The URL query parameters of the project filters */
export const QUERY_PARAM = "q";
export const TAG_PARAM = "tag";

export const SEARCH_DEBOUNCE_MS = 250;

/**
 * How many cards load their images eagerly: the first two, which are in
 * the first screen at any width; the rest load lazily
 */
export const EAGER_IMAGE_COUNT = 2;

/** How many projects the home page shows: one row of the grid */
export const RECENT_PROJECT_COUNT = 3;

/** The path of a project's detail view */
export const toWorkEntryPath = (slug: string): string =>
  `${BASE_ROUTES.work}/${slug}`;

/**
 * The library Card's title link (its class), which ProjectGrid routes in
 * the app.
 * TODO(L2c): library Card link render prop, to render a router <Link>.
 */
export const CARD_LINK_SELECTOR = ".card__link";

/**
 * The history state of a detail view opened from a page's project card:
 * with `returnOnClose`, closing goes back to that page (history back) while
 * the query string is still `search` (the projects page's filters when the
 * card opened it; empty from elsewhere).
 */
export interface IWorkEntryLocationState {
  returnOnClose?: boolean;
  search?: string;
}
