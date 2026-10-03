import type { FunctionComponent } from "react";

import PageContainer from "@app/common/Components/PageContainer";
import ResumeDisplay from "@app/Resume/Components/ResumeDisplay";
import DownloadSvg from "@app/assets/DownloadSvg";
import { safeOpenWindow } from "@app/common/utils/browser";

const ResumePage: FunctionComponent = () => (
  <PageContainer title="Résumé" documentTitle="Résumé">
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
