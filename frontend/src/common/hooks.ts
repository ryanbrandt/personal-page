import { type RefObject, useEffect, useEffectEvent } from "react";
import { useNavigate } from "react-router";

// The heading of the page the app loaded with. StrictMode's replayed
// effect sees the same element, so it can't pass for a second page.
let firstHeading: HTMLElement | undefined;

/**
 * Marks `headingRef`'s element (the page's `<h1>`, with tabIndex={-1}) as
 * its page's heading. A page that mounts after the first one scrolls to
 * the top and focuses it, so screen readers announce the new page; the
 * page the app loaded with keeps the browser's own scroll and focus.
 *
 * Every routed page must use it exactly once, as the first page to mount
 * is taken as the one the app loaded with. PageContainer does; a page that
 * renders its own `<h1>` instead (e.g. a home hero) calls it itself.
 *
 * A new path that keeps the page mounted (e.g. a project's dialog at
 * /work/:slug) moves neither scroll nor focus.
 */
export const useFocusHeadingOnPageMount = (
  headingRef: RefObject<HTMLElement | null>
): void => {
  useEffect(() => {
    const heading = headingRef.current!;
    firstHeading ??= heading;
    if (heading === firstHeading) return;

    window.scrollTo(0, 0);
    heading.focus({ preventScroll: true });
  }, [headingRef]);
};

/**
 * Client-side navigation for the links matching `linkSelector` inside
 * `containerRef`: links rendered by components that only take an `href`
 * (e.g. the library's Card and Button), not a router `<Link>`. Like `<Link>`,
 * it leaves to the browser modified clicks (new tab, …), links with a
 * `target` other than `_self` or a `download`, and links to other origins.
 *
 * TODO(L2c): library Card and Button link render props; then use router
 * <Link>s.
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
