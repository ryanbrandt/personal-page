import { FunctionComponent, JSX } from "react";

import PageContainer from "@app/common/Components/PageContainer";
import LinkedinSvg from "@app/assets/svg/LinkedInSvg";
import GithubSvg from "@app/assets/svg/GithubSvg";
import { safeOpenWindow } from "@app/common/utils/browser";
import { GITHUB_URL, LINKEDIN_URL } from "@app/common/constants/urls";

const LandingPage: FunctionComponent = (): JSX.Element => (
  <PageContainer title="Hello, World!">
    <div className="landing-page">
      <p className="landing-page__copy">
        My name is <strong>Ryan Brandt</strong>. I'm a Software Engineer based
        out of Philadelphia.
      </p>
      <div className="landing-page__social-links">
        <LinkedinSvg onClick={() => safeOpenWindow(LINKEDIN_URL)} />
        <GithubSvg onClick={() => safeOpenWindow(GITHUB_URL)} />
      </div>
    </div>
  </PageContainer>
);

export default LandingPage;
