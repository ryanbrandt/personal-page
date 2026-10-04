import {
  type FunctionComponent,
  type ReactNode,
  startTransition,
  useLayoutEffect,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  Router,
  UNSAFE_createBrowserHistory as createBrowserHistory,
} from "react-router";

import { pageOf } from "@app/routes/utils";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const canCrossFade = () =>
  typeof document.startViewTransition === "function" &&
  !window.matchMedia(REDUCED_MOTION_QUERY).matches;

interface IPageTransitionRouterProps {
  children: ReactNode;
}

/**
 * React Router's `<BrowserRouter>` (built the same way, on the history it
 * exports as UNSAFE_createBrowserHistory), plus a cross-fade (a View
 * Transition, styled in styles/routes) whenever the page changes, whichever
 * way: a link, `navigate`, or back and forward. Router's own
 * `viewTransition` option needs a data router and is set per navigation;
 * this decides in one place.
 *
 * Everything else updates as `<BrowserRouter>` does, in a React transition:
 * a new path on the same page (a project's dialog at /work/:slug animates
 * itself, and the projects' filters must see the new query at once, not a
 * frame later), browsers without View Transitions, and every navigation
 * under reduced motion.
 *
 * The cross-fade renders the new page synchronously (flushSync) inside the
 * View Transition's update, so the new page's layout effects (its scroll
 * and focus, see useFocusHeadingOnPageMount) run before it's captured.
 */
const PageTransitionRouter: FunctionComponent<IPageTransitionRouterProps> = ({
  children,
}) => {
  const [history] = useState(() => createBrowserHistory({ v5Compat: true }));
  const [{ action, location }, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => {
    let page = pageOf(history.location.pathname);
    return history.listen((update) => {
      const nextState = { action: update.action, location: update.location };
      const nextPage = pageOf(update.location.pathname);
      const pageChanged = nextPage !== page;
      page = nextPage;

      if (pageChanged && canCrossFade()) {
        document.startViewTransition(() =>
          flushSync(() => setState(nextState))
        );
      } else {
        startTransition(() => setState(nextState));
      }
    });
  }, [history]);

  return (
    <Router location={location} navigationType={action} navigator={history}>
      {children}
    </Router>
  );
};

export default PageTransitionRouter;
