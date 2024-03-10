import { FunctionComponent } from "react";

import GithubSvg from "@app/assets/svg/GithubSvg";
import SocialLink from "@app/Contact/Subcomponents/SocialLink";
import LinkedinSvg from "@app/assets/svg/LinkedInSvg";

const SocialLinks: FunctionComponent = (): JSX.Element => (
  <div className="contact-page__social-links">
    <h2>Social Links</h2>
    <SocialLink label="Code with Me" link="todo" icon={<GithubSvg />} />
    <SocialLink label="Connect with Me" link="todo" icon={<LinkedinSvg />} />
  </div>
);

export default SocialLinks;
