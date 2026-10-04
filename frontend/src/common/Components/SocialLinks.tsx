import type { FunctionComponent } from "react";

import { SOCIAL_LINKS } from "@app/common/constants/socialLinks";

interface Props {
  className?: string;
}

/**
 * Ryan's profiles elsewhere, as icon links that open in a new tab. The
 * container can resize the icons with `--social-icon-size`.
 */
const SocialLinks: FunctionComponent<Props> = ({ className }) => (
  // role="list": Safari drops list semantics under `list-style: none`.
  // eslint-disable-next-line jsx-a11y-x/no-redundant-roles
  <ul
    role="list"
    className={className ? `social-links ${className}` : "social-links"}
  >
    {SOCIAL_LINKS.map(({ label, url, Icon }) => (
      <li key={label}>
        <a
          href={url}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon aria-hidden="true" />
        </a>
      </li>
    ))}
  </ul>
);

export default SocialLinks;
