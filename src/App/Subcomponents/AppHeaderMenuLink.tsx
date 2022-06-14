import { FunctionComponent } from "react";
import { useNavigate } from "react-router";
import { createCompositeClassName } from "@ryanbrandt/react-quick-ui";

import { IAppHeaderMenuLink } from "@app/App/types";

type Props = IAppHeaderMenuLink;

const AppHeaderMenuLink: FunctionComponent<Props> = ({
  text,
  route,
  active = false,
}: Props): JSX.Element => {
  const navigate = useNavigate();

  const classNames = createCompositeClassName({
    "app-header__menu__link": true,
    "app-header__menu__link--active": active,
  });

  return (
    <div className={classNames}>
      <a
        onClick={() => navigate(route)}
        className="app-header__menu__link__anchor"
      >
        {text}
      </a>
    </div>
  );
};

export default AppHeaderMenuLink;
