import {
  type RefObject,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
} from "react";
import { useNavigate } from "react-router";

import { hasReturnTarget, takeReturnTarget } from "@app/common/returnFocus";

// The headings that leave scroll and focus alone: the page the app loaded
// with, and a page that returns focus to a link of its own. StrictMode's
// replayed effect sees the same element, so it leaves them alone too.
let firstPageMounted = false;
const headingsLeftAlone = new WeakSet<HTMLElement>();

/**
 * Marks `headingRef`'s element (the page's `<h1>`, with tabIndex={-1}) as
 * its page's heading. A page that mounts after the first one scrolls to
 * the top and focuses it, so screen readers announce the new page; the
 * page the app loaded with keeps the browser's own scroll and focus, and
 * so does a page mounting with a return target pending (returnFocus.ts),
 * whose useFocusReturnTarget moves them instead.
 *
 * Every routed page must use it exactly once, as the first page to mount
 * is taken as the one the app loaded with. PageContainer does; a page that
 * renders its own `<h1>` instead (e.g. a home hero) calls it itself.
 *
 * A new path that keeps the page mounted (e.g. a project's dialog at
 * /work/:slug) moves neither scroll nor focus.
 *
 * A layout effect, so the page doesn't paint before scrolling, and so it
 * runs before a later component's useFocusReturnTarget takes the target.
 */
export const useFocusHeadingOnPageMount = (
  headingRef: RefObject<HTMLElement | null>
): void => {
  useLayoutEffect(() => {
    const heading = headingRef.current!;
    if (!firstPageMounted || hasReturnTarget()) {
      firstPageMounted = true;
      headingsLeftAlone.add(heading);
    }
    if (headingsLeftAlone.has(heading)) return;

    window.scrollTo(0, 0);
    heading.focus({ preventScroll: true });
  }, [headingRef]);
};

/**
 * Focuses the pending return target (returnFocus.ts), if it's one of the
 * links matching `linkSelector` in `containerRef`, and scrolls it into
 * view, before the page paints. Its page's heading leaves focus alone (see
 * useFocusHeadingOnPageMount), so the component using this must come after
 * the heading.
 */
export const useFocusReturnTarget = (
  containerRef: RefObject<HTMLElement | null>,
  linkSelector: string
): void => {
  useLayoutEffect(() => {
    const target = takeReturnTarget();
    if (!target) return;

    const link = Array.from(
      containerRef.current!.querySelectorAll<HTMLAnchorElement>(linkSelector)
    ).find(({ href }) => new URL(href).pathname === target);
    link?.focus({ preventScroll: true });
    link?.scrollIntoView({ block: "center" });
  }, [containerRef, linkSelector]);
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
