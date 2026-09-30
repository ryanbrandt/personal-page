import type { FunctionComponent, ReactElement } from "react";

interface Props {
  label: string;
  link: string;
  icon: ReactElement;
}

const SocialLink: FunctionComponent<Props> = ({ label, link, icon }) => (
  <a href={link} className="contact-page__social-links__link">
    {icon}
    {label}
  </a>
);

export default SocialLink;
