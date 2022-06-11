import { FunctionComponent } from "react";

import AppHeaderLink, {
  Props as AppHeaderLinkProps,
} from "@app/App/Subcomponents/AppHeaderMenuLink";

interface Props {
  links: Array<AppHeaderLinkProps>;
}

const AppHeaderMenu: FunctionComponent<Props> = ({
  links,
}: Props): JSX.Element => (
  <div className="app-header__menu">
    {links.map(({ text, route, active }) => (
      <AppHeaderLink key={text} text={text} route={route} active={active} />
    ))}
  </div>
);

export default AppHeaderMenu;
