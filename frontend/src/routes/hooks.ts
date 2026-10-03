import { useEffect, useRef } from "react";
import { matchPath, useLocation } from "react-router";

import { CONTENT_ID } from "@app/App/constants";

/**
 * After a route change, scrolls to the top and focuses the new page's `<h1>`
 * so screen readers announce it. The first page load keeps the browser's
 * own scroll and focus, and so does a new path within the same route (e.g.
 * `/work` to `/work/:slug`, which opens a dialog over the page).
 *
 * @param routePatterns The app's route patterns; a path matching none is
 * its own route.
 */
export const useResetScrollAndFocusOnRouteChange = (
  routePatterns: ReadonlyArray<string>
): void => {
  const { pathname } = useLocation();
  const route =
    routePatterns.find((pattern) => matchPath(pattern, pathname)) ?? pathname;
  const previousRoute = useRef(route);

  useEffect(() => {
    if (route === previousRoute.current) return;
    previousRoute.current = route;

    window.scrollTo(0, 0);
    document
      .querySelector<HTMLElement>(`#${CONTENT_ID} h1`)
      ?.focus({ preventScroll: true });
  }, [route]);
};
