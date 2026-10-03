import { type RefObject, useEffect, useEffectEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";

import type { IWorkFilters } from "@app/Work/types";
import { BASE_ROUTES } from "@app/routes/constants";
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Each change starts from the URL as it is now, not as it was when this
  // render happened: a debounced search write can land after a chip click
  // or a card opening a project (router navigations render in transitions,
  // so the render's own search params and path can be out of date). It
  // keeps the current path and history state (e.g. a project dialog's
  // IWorkEntryLocationState), and writes nothing once the app has left the
  // projects page.
  const updateParams = (update: (params: URLSearchParams) => void) => {
    const { pathname } = window.location;
    if (
      pathname !== BASE_ROUTES.work &&
      !pathname.startsWith(`${BASE_ROUTES.work}/`)
    ) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    update(params);
    const search = params.toString();
    // The router keeps a navigation's `state` in `history.state.usr`.
    const { usr } = (window.history.state ?? {}) as { usr?: unknown };
    void navigate(
      { pathname, search: search ? `?${search}` : "" },
      { replace: true, state: usr }
    );
  };

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
    // Rebuilds the tag list: the two-argument has()/delete() aren't in
    // Safari 16.
    toggleTag: (tag) =>
      updateParams((params) => {
        const tags = params.getAll(TAG_PARAM);
        params.delete(TAG_PARAM);
        const next = tags.includes(tag)
          ? tags.filter((chosen) => chosen !== tag)
          : [...tags, tag];
        next.forEach((chosen) => params.append(TAG_PARAM, chosen));
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
 * (e.g. the library's Card), not a router `<Link>`. Like `<Link>`, it leaves
 * to the browser modified clicks (new tab, …), links with a `target` other
 * than `_self` or a `download`, and links to other origins.
 *
 * TODO(L2c): library Card link render prop; then use a router <Link>.
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
    if (!link || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    if (
      (link.target && link.target !== "_self") ||
      link.hasAttribute("download")
    ) {
      return;
    }
    const url = new URL(link.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    void navigate(`${url.pathname}${url.search}${url.hash}`, { state });
  });

  useEffect(() => {
    const container = containerRef.current!;
    const listener = (event: MouseEvent) => handleClick(event);
    container.addEventListener("click", listener);
    return () => container.removeEventListener("click", listener);
  }, [containerRef]);
};
