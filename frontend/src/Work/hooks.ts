import { type RefObject, useEffect, useEffectEvent, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";

import type { IWorkFilters } from "@app/Work/types";
import { QUERY_PARAM, TAG_PARAM } from "@app/Work/constants";

interface IWorkFiltersControls extends IWorkFilters {
  setQuery: (query: string) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
}

/**
 * The project filters, read from and written to the URL query (`?q=` and
 * one `tag=` per chosen tag), which is their only source of truth, so a
 * filtered list can be shared. Changes replace the history entry: Back
 * leaves the page rather than stepping through each keystroke.
 */
export const useWorkFilters = (): IWorkFiltersControls => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = (update: (params: URLSearchParams) => void) =>
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        update(next);
        return next;
      },
      { replace: true }
    );

  return {
    query: searchParams.get(QUERY_PARAM) ?? "",
    tags: searchParams.getAll(TAG_PARAM),
    setQuery: (query) =>
      updateParams((params) => {
        if (query) {
          params.set(QUERY_PARAM, query);
        } else {
          params.delete(QUERY_PARAM);
        }
      }),
    toggleTag: (tag) =>
      updateParams((params) => {
        if (params.has(TAG_PARAM, tag)) {
          params.delete(TAG_PARAM, tag);
        } else {
          params.append(TAG_PARAM, tag);
        }
      }),
    clearFilters: () =>
      updateParams((params) => {
        params.delete(QUERY_PARAM);
        params.delete(TAG_PARAM);
      }),
  };
};

/**
 * Client-side navigation for the links matching `linkSelector` inside
 * `containerRef`: links rendered by components that only take an `href`
 * (e.g. the library's Card), not a router `<Link>`. Plain left clicks
 * navigate in the app with `state`; modified clicks (new tab, …) keep the
 * browser's default.
 */
export const useClientSideLinks = (
  containerRef: RefObject<HTMLElement | null>,
  linkSelector: string,
  state?: unknown
): void => {
  const navigate = useNavigate();

  const handleClick = useEffectEvent((event: MouseEvent) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>(
      linkSelector
    );
    const modified =
      event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
    if (!link || event.defaultPrevented || event.button !== 0 || modified) {
      return;
    }

    event.preventDefault();
    void navigate(link.getAttribute("href")!, { state });
  });

  useEffect(() => {
    const container = containerRef.current!;
    const listener = (event: MouseEvent) => handleClick(event);
    container.addEventListener("click", listener);
    return () => container.removeEventListener("click", listener);
  }, [containerRef]);
};

/**
 * Closing a detail view returns focus to the card that opened it (the
 * Dialog does that). A deep link had no card to return to, so focus would
 * be lost (left on the closing dialog, or the page): this sends it to the
 * project's card instead.
 */
export const useFocusCardOnDeepLinkClose = (slug: string | undefined): void => {
  const previousSlug = useRef(slug);

  useEffect(() => {
    const closedSlug = previousSlug.current;
    previousSlug.current = slug;
    const focused = document.activeElement;
    const focusReturned =
      focused && focused !== document.body && !focused.closest("dialog");
    if (!closedSlug || slug || focusReturned) return;

    // ProjectGrid marks each card's list item with its slug.
    document
      .querySelector<HTMLElement>(`[data-slug="${closedSlug}"] .card__link`)
      ?.focus();
  }, [slug]);
};
