import type { FunctionComponent } from "react";

import { SOCIAL_LINKS } from "@app/common/constants/socialLinks";

interface Props {
  /** The icons' size, in pixels; each link's hit area is 44px square */
  iconSize: number;
  className: string;
}

/** Ryan's profiles elsewhere, as icon links that open in a new tab. */
const SocialLinks: FunctionComponent<Props> = ({ iconSize, className }) => (
  // role="list": Safari drops list semantics under `list-style: none`.
  // eslint-disable-next-line jsx-a11y-x/no-redundant-roles
  <ul role="list" className={`social-links ${className}`}>
    {SOCIAL_LINKS.map(({ label, url, Icon }) => (
      <li key={label}>
        <a
          href={url}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon aria-hidden="true" width={iconSize} height={iconSize} />
        </a>
      </li>
    ))}
  </ul>
);

export default SocialLinks;
