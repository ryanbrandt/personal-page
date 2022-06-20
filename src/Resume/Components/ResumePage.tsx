import { FunctionComponent } from "react";

import PageContainer from "@app/common/Components/PageContainer";
import ResumeDisplay from "@app/Resume/Components/ResumeDisplay";

const ResumePage: FunctionComponent = (): JSX.Element => (
  <PageContainer title="Resume">
    <div className="resume-page">
      <ResumeDisplay />
    </div>
  </PageContainer>
);

export default ResumePage;
