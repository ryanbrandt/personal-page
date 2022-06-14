import { FunctionComponent } from "react";
import { useNavigate } from "react-router";
import { createCompositeClassName } from "@ryanbrandt/react-quick-ui";

import { IAppHeaderMenuLink } from "@app/App/types";

interface Props extends IAppHeaderMenuLink {
  onClose: () => void;
}

const MobileAppheaderMenuLink: FunctionComponent<Props> = ({
  text,
  route,
  active = false,
  onClose,
}: Props): JSX.Element => {
  const navigate = useNavigate();

  const handleLinkClick = (): void => {
    navigate(route);
    onClose();
  };

  const classNames = createCompositeClassName({
    "app-header__mobile-menu__overlay__link-container__link": true,
    "app-header__mobile-menu__overlay__link-container__link--active": active,
  });

  return (
    <div className={classNames}>
      <a
        className="app-header__mobile-menu__overlay__link-container__link__anchor"
        onClick={handleLinkClick}
      >
        {text}
      </a>
    </div>
  );
};

export default MobileAppheaderMenuLink;
