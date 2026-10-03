import type { FunctionComponent } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { NavBar, ThemeToggle } from "@ryanbrandt/react-quick-ui";

import type { IAppHeaderMenuLink } from "@app/App/types";
import { useThemePreference } from "@app/App/hooks";
import { BASE_ROUTES } from "@app/routes/constants";

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
  const [theme, setTheme] = useThemePreference();
  // NavBar closes its narrow-screen menu when a link in it is chosen, but
  // not on other navigation (e.g. back/forward). Keying it on the path
  // resets it whenever the page changes, and only then: a remount drops
  // focus, which the route change hook only restores for a new path.
  const { pathname } = useLocation();

  return (
    <NavBar
      key={pathname}
      className="app-header"
      brand={
        <Link to={BASE_ROUTES.home} className="app-header__brand">
          <span aria-hidden="true" className="app-header__brand__monogram">
            RB
          </span>
          <span className="app-header__brand__name">Ryan Brandt</span>
        </Link>
      }
      actions={<ThemeToggle value={theme} onChange={setTheme} />}
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
