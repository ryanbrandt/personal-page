import { FunctionComponent, useState } from "react";

import MobileAppHeaderMenuOverlay from "@app/App/Subcomponents/MobileAppHeaderMenuOverlay";
import BurgerMenuSvg from "@app/assets/svg/BurgerMenuSvg";
import { IAppHeaderMenuLink } from "@app/App/types";
import AppHeaderThemeToggle from "./AppHeaderThemeToggle";

interface Props {
  links: Array<IAppHeaderMenuLink>;
}

const MobileAppHeaderMenu: FunctionComponent<Props> = (
  props: Props
): JSX.Element => {
  const { links } = props;

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-header__mobile-menu">
      <BurgerMenuSvg onClick={() => setMenuOpen(true)} />
      <MobileAppHeaderMenuOverlay
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        links={links}
      />
    </div>
  );
};

export default MobileAppHeaderMenu;
