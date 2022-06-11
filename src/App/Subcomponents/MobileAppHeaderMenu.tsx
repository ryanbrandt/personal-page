import { FunctionComponent, useState } from "react";

import MobileAppHeaderMenuOverlay from "@app/App/Subcomponents/MobileAppHeaderMenuOverlay";
import BurgerMenuSvg from "@app/assets/svg/BurgerMenuSvg";

const MobileAppHeaderMenu: FunctionComponent = (): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-header__mobile-menu">
      <BurgerMenuSvg onClick={() => setMenuOpen(true)} />
      <MobileAppHeaderMenuOverlay
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
      />
    </div>
  );
};

export default MobileAppHeaderMenu;
