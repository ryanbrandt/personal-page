import type { FunctionComponent } from "react";
import { Link, useMatch } from "react-router";
import { createCompositeClassName } from "@ryanbrandt/react-quick-ui";

import type { IAppHeaderMenuLink } from "@app/App/types";

type Props = IAppHeaderMenuLink;

const AppHeaderMenuLink: FunctionComponent<Props> = ({ text, route }) => {
  const active = useMatch(route) !== null;

  const classNames = createCompositeClassName({
    "app-header__menu__link": true,
    "app-header__menu__link--active": active,
  });

  return (
    <div className={classNames}>
      <Link
        to={route}
        aria-current={active ? "page" : undefined}
        className="app-header__menu__link__anchor"
      >
        {text}
      </Link>
    </div>
  );
};

export default AppHeaderMenuLink;
