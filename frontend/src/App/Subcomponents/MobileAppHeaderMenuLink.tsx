import type { FunctionComponent } from "react";
import { Link, useMatch } from "react-router";
import { createCompositeClassName } from "@ryanbrandt/react-quick-ui";

import type { IAppHeaderMenuLink } from "@app/App/types";

type Props = IAppHeaderMenuLink;

const MobileAppheaderMenuLink: FunctionComponent<Props> = ({ text, route }) => {
  const active = useMatch(route) !== null;

  const classNames = createCompositeClassName({
    "app-header__mobile-menu__overlay__link-container__link": true,
    "app-header__mobile-menu__overlay__link-container__link--active": active,
  });

  return (
    <div className={classNames}>
      <Link
        to={route}
        aria-current={active ? "page" : undefined}
        className="app-header__mobile-menu__overlay__link-container__link__anchor"
      >
        {text}
      </Link>
    </div>
  );
};

export default MobileAppheaderMenuLink;
