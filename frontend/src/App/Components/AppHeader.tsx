import { FunctionComponent, useContext, useMemo } from "react";
import { useLocation } from "react-router";
import { TopBar } from "@ryanbrandt/react-quick-ui";

import { IAppHeaderMenuLink } from "@app/App/types";
import MobileContext from "@app/common/contexts/MobileContext";
import { BASE_ROUTES } from "@app/routes/constants";
import AppHeaderMenu from "@app/App/Subcomponents/AppHeaderMenu";
import MobileAppHeaderMenu from "@app/App/Subcomponents/MobileAppHeaderMenu";
import AppHeaderThemeToggle from "../Subcomponents/AppHeaderThemeToggle";

export const MENU_LINKS: Array<IAppHeaderMenuLink> = [
  {
    text: "Home",
    route: BASE_ROUTES.home,
  },
  {
    text: "Résumé",
    route: BASE_ROUTES.resumé,
  },
  {
    text: "Personal Projects",
    route: BASE_ROUTES.work,
  },
  {
    text: "Contact",
    route: BASE_ROUTES.contact,
  },
];

const AppHeader: FunctionComponent = (): JSX.Element => {
  const isMobile = useContext(MobileContext);
  const { pathname } = useLocation();

  const links = useMemo(
    () =>
      MENU_LINKS.map((menuLink) => ({
        ...menuLink,
        active: pathname === menuLink.route,
      })),
    [pathname]
  );

  return (
    <TopBar className="app-header">
      {isMobile ? (
        <MobileAppHeaderMenu links={links} />
      ) : (
        <AppHeaderMenu links={links} />
      )}
      <AppHeaderThemeToggle />
    </TopBar>
  );
};

export default AppHeader;
