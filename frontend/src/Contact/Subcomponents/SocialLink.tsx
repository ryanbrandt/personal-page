import type { FunctionComponent, ReactElement } from "react";

interface Props {
  label: string;
  link: string;
  icon: ReactElement;
}

const SocialLink: FunctionComponent<Props> = ({ label, link, icon }: Props) => (
  <a href={link} className="contact-page__social-links__link">
    {icon}
    {label}
  </a>
);

export default SocialLink;
