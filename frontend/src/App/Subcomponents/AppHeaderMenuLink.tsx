import type { FunctionComponent } from "react";
import { NavLink, useMatch } from "react-router";
import { createCompositeClassName } from "@ryanbrandt/react-quick-ui";

import type { IAppHeaderMenuLink } from "@app/App/types";

type Props = IAppHeaderMenuLink;

const AppHeaderMenuLink: FunctionComponent<Props> = ({ text, route }) => {
  const active = useMatch(route) !== null;

  const classNames = createCompositeClassName({
    "app-header__menu__link": true,
    "app-header__menu__link--active": active,
  });

  // The wrapper carries the active modifier. A function className stops
  // NavLink from adding its own `active` class to the anchor.
  return (
    <div className={classNames}>
      <NavLink
        to={route}
        end
        className={() => "app-header__menu__link__anchor"}
      >
        {text}
      </NavLink>
    </div>
  );
};

export default AppHeaderMenuLink;
