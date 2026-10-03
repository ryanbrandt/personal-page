import type { FunctionComponent } from "react";

import LinkedinSvg from "@app/assets/svg/LinkedInSvg";
import GithubSvg from "@app/assets/svg/GithubSvg";
import { GITHUB_URL, LINKEDIN_URL } from "@app/common/constants/urls";

const SOCIAL_LINKS = [
  { label: "LinkedIn", url: LINKEDIN_URL, Icon: LinkedinSvg },
  { label: "GitHub", url: GITHUB_URL, Icon: GithubSvg },
];

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
