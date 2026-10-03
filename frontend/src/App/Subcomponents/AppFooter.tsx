import type { FunctionComponent } from "react";

import { SOCIAL_LINKS } from "@app/common/constants/socialLinks";

const AppFooter: FunctionComponent = () => (
  <footer className="app-footer">
    <span>© {new Date().getFullYear()} Ryan Brandt</span>
    <ul className="app-footer__social-links">
      {SOCIAL_LINKS.map(({ label, url, Icon }) => (
        <li key={label}>
          <a href={url} aria-label={label} target="_blank" rel="noreferrer">
            <Icon aria-hidden="true" width={20} height={20} />
          </a>
        </li>
      ))}
    </ul>
  </footer>
);

export default AppFooter;
