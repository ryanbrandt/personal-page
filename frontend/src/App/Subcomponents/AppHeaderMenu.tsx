import type { FunctionComponent } from "react";

import AppHeaderLink from "@app/App/Subcomponents/AppHeaderMenuLink";
import type { IAppHeaderMenuLink } from "@app/App/types";

interface Props {
  links: Array<IAppHeaderMenuLink>;
}

const AppHeaderMenu: FunctionComponent<Props> = ({ links }: Props) => (
  <div className="app-header__menu">
    {links.map(({ text, route, active }) => (
      <AppHeaderLink key={text} text={text} route={route} active={active} />
    ))}
  </div>
);

export default AppHeaderMenu;
