import type { FunctionComponent } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { NavBar, ThemeToggle } from "@ryanbrandt/react-quick-ui";

import type { IAppHeaderMenuLink } from "@app/App/types";
import { type ShownTheme, useShownTheme } from "@app/App/hooks";
import { OWNER_NAME } from "@app/common/constants/site";
import { BASE_ROUTES } from "@app/routes/constants";

// No "system" option: with nothing chosen, the page follows the OS, and the
// toggle shows the theme it resolves to.
const THEME_OPTIONS: ReadonlyArray<ShownTheme> = ["light", "dark"];

// TODO(R9): add Contact (BASE_ROUTES.contact) once /contact has a page.
const MENU_LINKS: Array<IAppHeaderMenuLink> = [
  {
    text: "Home",
    route: BASE_ROUTES.home,
  },
  {
    text: "Résumé",
    route: BASE_ROUTES.resumé,
  },
  {
    text: "Projects",
    route: BASE_ROUTES.work,
  },
];

const AppHeader: FunctionComponent = () => {
  const [theme, setTheme] = useShownTheme();
  // NavBar closes its narrow-screen menu when a link in it is chosen, but
  // not on other navigation (e.g. back/forward). Keying it on the path's
  // first segment (the page) resets it whenever the page changes, and only
  // then: a remount drops focus, which the new page's heading takes (see
  // useFocusHeadingOnPageMount), while /work to /work/:slug keeps it.
  const page = useLocation().pathname.split("/")[1];

  return (
    <NavBar
      key={page}
      className="app-header"
      brand={
        <Link to={BASE_ROUTES.home} className="app-header__brand">
          <span aria-hidden="true" className="app-header__brand__monogram">
            RB
          </span>
          <span className="app-header__brand__name">{OWNER_NAME}</span>
        </Link>
      }
      actions={
        <ThemeToggle
          value={theme}
          onChange={setTheme}
          options={THEME_OPTIONS}
        />
      }
    >
      {MENU_LINKS.map(({ text, route }) => (
        <NavLink key={route} to={route}>
          {text}
        </NavLink>
      ))}
    </NavBar>
  );
};

export default AppHeader;
