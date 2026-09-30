import type { FunctionComponent } from "react";
import { NavLink, useMatch } from "react-router";
import { createCompositeClassName } from "@ryanbrandt/react-quick-ui";

import type { IAppHeaderMenuLink } from "@app/App/types";

interface Props extends IAppHeaderMenuLink {
  onClose: () => void;
}

const MobileAppheaderMenuLink: FunctionComponent<Props> = ({
  text,
  route,
  onClose,
}) => {
  const active = useMatch(route) !== null;

  const classNames = createCompositeClassName({
    "app-header__mobile-menu__overlay__link-container__link": true,
    "app-header__mobile-menu__overlay__link-container__link--active": active,
  });

  // See AppHeaderMenuLink for why className is a function.
  return (
    <div className={classNames}>
      <NavLink
        to={route}
        end
        className={() =>
          "app-header__mobile-menu__overlay__link-container__link__anchor"
        }
        onClick={onClose}
      >
        {text}
      </NavLink>
    </div>
  );
};

export default MobileAppheaderMenuLink;
