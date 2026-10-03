import type { FunctionComponent } from "react";

import SocialLinks from "@app/common/Components/SocialLinks";

// AppFooter.scss lines the icons up with the gutter from this size.
const SOCIAL_ICON_SIZE = 20;

const AppFooter: FunctionComponent = () => (
  <footer className="app-footer">
    <span>© {new Date().getFullYear()} Ryan Brandt</span>
    <SocialLinks
      iconSize={SOCIAL_ICON_SIZE}
      className="app-footer__social-links"
    />
  </footer>
);

export default AppFooter;
