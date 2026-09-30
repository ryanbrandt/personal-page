import { createCompositeClassName } from "@ryanbrandt/react-quick-ui";
import type { FunctionComponent } from "react";

import type { IAppHeaderMenuLink } from "@app/App/types";
import MobileAppheaderMenuLink from "@app/App/Subcomponents/MobileAppHeaderMenuLink";

interface Props {
  open: boolean;
  onClose: () => void;
  links: Array<IAppHeaderMenuLink>;
}

const MobileAppHeaderMenuOverlay: FunctionComponent<Props> = ({
  open,
  onClose,
  links,
}) => {
  const classNames = createCompositeClassName({
    "app-header__mobile-menu__overlay": true,
    "app-header__mobile-menu__overlay--closed": !open,
    "app-header__mobile-menu__overlay--open": open,
  });

  return (
    <div className={classNames}>
      <div
        onClick={onClose}
        className="app-header__mobile-menu__overlay__close-btn"
      >
        x
      </div>
      <div className="app-header__mobile-menu__overlay__link-container">
        {links.map(({ text, route }) => (
          <MobileAppheaderMenuLink key={text} text={text} route={route} />
        ))}
      </div>
    </div>
  );
};

export default MobileAppHeaderMenuOverlay;
