import type { FunctionComponent } from "react";

import PageContainer from "@app/common/Components/PageContainer";
import { safeOpenWindow } from "@app/common/utils/browser";
import { SOCIAL_LINKS } from "@app/common/constants/socialLinks";
import { HOME_TITLE } from "@app/common/utils/documentTitle";

const LandingPage: FunctionComponent = () => (
  <PageContainer title="Hello, World!" documentTitle={HOME_TITLE}>
    <div className="landing-page">
      <p className="landing-page__copy">
        My name is <strong>Ryan Brandt</strong>. I'm a Software Engineer based
        out of Philadelphia.
      </p>
      <div className="landing-page__social-links">
        {SOCIAL_LINKS.map(({ label, url, Icon }) => (
          <Icon key={label} onClick={() => safeOpenWindow(url)} />
        ))}
      </div>
    </div>
  </PageContainer>
);

export default LandingPage;
