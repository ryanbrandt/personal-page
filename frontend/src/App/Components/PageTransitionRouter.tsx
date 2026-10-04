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

/**
 * The browser history, with the browser's own scroll restoration off: on
 * Back it would scroll the old page before the cross-fade captures it, so
 * the outgoing page would jump. The app owns scroll instead: a page that
 * mounts scrolls to the top (useFocusHeadingOnPageMount), and a new path on
 * the same page leaves it alone. The trade-off: a reload starts at the top.
 */
const createHistory = () => {
  window.history.scrollRestoration = "manual";
  return createBrowserHistory({ v5Compat: true });
};

type History = ReturnType<typeof createHistory>;

/** What the router renders: the history's current location and action. */
const stateOf = ({ action, location }: History) => ({ action, location });

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
 * browsers without View Transitions, every navigation under reduced motion,
 * and a new path on the same page (a project's dialog at /work/:slug, which
 * animates itself, or the projects' filters). A View Transition defers its
 * update by a frame and swallows input while it runs, which a dialog
 * opening or a filter being typed shouldn't wait on.
 *
 * Both apply the history's latest state when they run, not the one that
 * started them: a cross-fade's update comes a frame later, after any
 * same-page update in between (e.g. two quick Backs), which it mustn't
 * undo. A new cross-fade skips one still running, as RouterProvider does.
 *
 * The cross-fade renders the new page synchronously (flushSync) inside the
 * View Transition's update, so the new page's layout effects (its scroll
 * and focus, see useFocusHeadingOnPageMount) run before it's captured.
 */
const PageTransitionRouter: FunctionComponent<IPageTransitionRouterProps> = ({
  children,
}) => {
  const [history] = useState(createHistory);
  const [{ action, location }, setState] = useState(() => stateOf(history));

  useLayoutEffect(() => {
    const applyLatest = () => setState(stateOf(history));
    let page = pageOf(history.location.pathname);

    return history.listen(({ location: nextLocation }) => {
      const nextPage = pageOf(nextLocation.pathname);
      const pageChanged = nextPage !== page;
      page = nextPage;

      if (pageChanged && canCrossFade()) {
        document.activeViewTransition?.skipTransition();
        document.startViewTransition(() => flushSync(applyLatest));
      } else {
        startTransition(applyLatest);
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
