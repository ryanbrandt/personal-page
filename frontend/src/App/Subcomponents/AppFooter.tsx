import type { FunctionComponent } from "react";

import SocialLinks from "@app/common/Components/SocialLinks";

const AppFooter: FunctionComponent = () => (
  <footer className="app-footer">
    <span>© {new Date().getFullYear()} Ryan Brandt</span>
    <SocialLinks className="app-footer__social-links" />
  </footer>
);

export default AppFooter;
