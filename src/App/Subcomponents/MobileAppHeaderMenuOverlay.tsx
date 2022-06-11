import { createCompositeClassName } from "@ryanbrandt/react-quick-ui";
import { FunctionComponent } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MobileAppHeaderMenuOverlay: FunctionComponent<Props> = ({
  open,
  onClose,
}: Props): JSX.Element => {
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
    </div>
  );
};

export default MobileAppHeaderMenuOverlay;
