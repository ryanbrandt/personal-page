import { FunctionComponent } from "react";
import { Button } from "@ryanbrandt/react-quick-ui";

import PageContainer from "@app/common/Components/PageContainer";
import ResumeDisplay from "@app/Resume/Components/ResumeDisplay";
import DownloadSvg from "@app/assets/DownloadSvg";
import { safeOpenWindow } from "@app/common/utils/browser";

const ResumePage: FunctionComponent = (): JSX.Element => (
  <PageContainer title="Résumé">
    <div className="resume-page">
      <div className="resume-page__download">
        <DownloadSvg
          onClick={() =>
            safeOpenWindow(
              "https://ryanbrandt-resume.s3.us-east-2.amazonaws.com/RyanBrandt_Resume_2024.pdf"
            )
          }
        />
      </div>
      <ResumeDisplay />
    </div>
  </PageContainer>
);

export default ResumePage;
