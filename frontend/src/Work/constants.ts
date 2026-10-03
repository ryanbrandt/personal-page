import { BASE_ROUTES } from "@app/routes/constants";

/** The URL query parameters of the project filters */
export const QUERY_PARAM = "q";
export const TAG_PARAM = "tag";

export const SEARCH_DEBOUNCE_MS = 250;

/** How many cards (the first row) load their images eagerly */
export const EAGER_IMAGE_COUNT = 3;

/** The path of a project's detail view */
export const toWorkEntryPath = (slug: string): string =>
  `${BASE_ROUTES.work}/${slug}`;

/**
 * The library Card's title link (its class), which ProjectGrid routes in
 * the app.
 * TODO(L2c): library Card link render prop, to render a router <Link>.
 */
export const CARD_LINK_SELECTOR = ".card__link";

/** The history state of a detail view opened from a project card */
export interface IWorkEntryLocationState {
  openedFromCard?: boolean;
}

export const OPENED_FROM_CARD_STATE: IWorkEntryLocationState = {
  openedFromCard: true,
};
