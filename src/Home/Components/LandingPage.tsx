import { FunctionComponent } from "react";

import PageContainer from "@app/common/Components/PageContainer";
import LinkedinSvg from "@app/assets/svg/LinkedInSvg";
import GithubSvg from "@app/assets/svg/GithubSvg";

const LandingPage: FunctionComponent = (): JSX.Element => (
  <PageContainer title="Hello, World!">
    <div className="landing-page">
      <p className="landing-page__copy">
        My name is <strong>Ryan Brandt</strong>. I'm a Software Engineer based
        out of Philadelphia.
      </p>
      <div className="landing-page__social-links">
        <LinkedinSvg />
        <GithubSvg />
      </div>
    </div>
  </PageContainer>
);

export default LandingPage;
