import { type FunctionComponent, useState } from "react";
import { useLocation } from "react-router";

import MobileAppHeaderMenuOverlay from "@app/App/Subcomponents/MobileAppHeaderMenuOverlay";
import BurgerMenuSvg from "@app/assets/svg/BurgerMenuSvg";
import type { IAppHeaderMenuLink } from "@app/App/types";

interface Props {
  links: Array<IAppHeaderMenuLink>;
}

const MobileAppHeaderMenu: FunctionComponent<Props> = ({ links }) => {
  // The menu stays open only at the location it was opened from, so any
  // navigation (a link, back/forward) closes it. Modifier-clicks that open a
  // new tab don't navigate, so they leave it open.
  const { key } = useLocation();
  const [openedAt, setOpenedAt] = useState<string | null>(null);

  return (
    <div className="app-header__mobile-menu">
      <BurgerMenuSvg onClick={() => setOpenedAt(key)} />
      <MobileAppHeaderMenuOverlay
        onClose={() => setOpenedAt(null)}
        open={openedAt === key}
        links={links}
      />
    </div>
  );
};

export default MobileAppHeaderMenu;
