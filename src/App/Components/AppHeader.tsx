import { FunctionComponent, useContext } from "react";
import { TopBar } from "@ryanbrandt/react-quick-ui";

import { Props as AppHeaderLinkProps } from "@app/App/Subcomponents/AppHeaderMenuLink";
import MobileContext from "@app/common/contexts/MobileContext";
import AppHeaderMenu from "@app/App/Subcomponents/AppHeaderMenu";
import MobileAppHeaderMenu from "@app/App/Subcomponents/MobileAppHeaderMenu";

export const MENU_LINKS: Array<AppHeaderLinkProps> = [
  {
    text: "Home",
    route: "/",
    active: true,
  },
  {
    text: "Work",
    route: "/work",
  },
  {
    text: "Resumé",
    route: "/resumé",
  },
  {
    text: "Contact",
    route: "/contact",
  },
];

const AppHeader: FunctionComponent = (): JSX.Element => {
  const isMobile = useContext(MobileContext);

  return (
    <TopBar className="app-header" sticky>
      {isMobile ? (
        <MobileAppHeaderMenu />
      ) : (
        <AppHeaderMenu links={MENU_LINKS} />
      )}
    </TopBar>
  );
};

export default AppHeader;
