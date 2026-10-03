import { type RefObject, useEffect } from "react";

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
