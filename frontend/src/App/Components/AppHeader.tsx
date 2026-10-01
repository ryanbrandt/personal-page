import { type FunctionComponent, useContext } from "react";
import { TopBar } from "@ryanbrandt/react-quick-ui";

import type { IAppHeaderMenuLink } from "@app/App/types";
import MobileContext from "@app/common/contexts/MobileContext";
import { BASE_ROUTES } from "@app/routes/constants";
import AppHeaderMenu from "@app/App/Subcomponents/AppHeaderMenu";
import MobileAppHeaderMenu from "@app/App/Subcomponents/MobileAppHeaderMenu";
import AppHeaderThemeToggle from "@app/App/Subcomponents/AppHeaderThemeToggle";

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
    text: "Personal Projects",
    route: BASE_ROUTES.work,
  },
  /*
  {
    text: "Contact",
    route: BASE_ROUTES.contact,
  },
  */
];

const AppHeader: FunctionComponent = () => {
  const isMobile = useContext(MobileContext);

  return (
    <TopBar className="app-header">
      {isMobile ? (
        <MobileAppHeaderMenu links={MENU_LINKS} />
      ) : (
        <AppHeaderMenu links={MENU_LINKS} />
      )}
      <AppHeaderThemeToggle />
    </TopBar>
  );
};

export default AppHeader;
