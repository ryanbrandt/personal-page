import { FunctionComponent } from "react";

interface Props {
  label: string;
  link: string;
  icon: JSX.Element;
}

const SocialLink: FunctionComponent<Props> = ({
  label,
  link,
  icon,
}: Props): JSX.Element => (
  <a href={link} className="contact-page__social-links__link">
    {icon}
    {label}
  </a>
);

export default SocialLink;
