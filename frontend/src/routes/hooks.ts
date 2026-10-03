import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

import { CONTENT_ID } from "@app/App/constants";

/**
 * After a route change, scrolls to the top and focuses the new page's `<h1>`
 * so screen readers announce it. The first page load keeps the browser's
 * own scroll and focus.
 */
export const useResetScrollAndFocusOnRouteChange = (): void => {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (pathname === previousPathname.current) return;
    previousPathname.current = pathname;

    window.scrollTo(0, 0);
    document
      .querySelector<HTMLElement>(`#${CONTENT_ID} h1`)
      ?.focus({ preventScroll: true });
  }, [pathname]);
};
