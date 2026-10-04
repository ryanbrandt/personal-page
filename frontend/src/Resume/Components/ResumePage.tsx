import type { FunctionComponent } from "react";
import { Button } from "@ryanbrandt/react-quick-ui";

import PageContainer from "@app/common/Components/PageContainer";
import { OWNER_NAME } from "@app/common/constants/site";
import { RESUME_PDF_URL } from "@app/common/constants/urls";
import { toDocumentTitle } from "@app/common/utils/documentTitle";
import ResumeDisplay from "@app/Resume/Components/ResumeDisplay";

// The name line is shown only in print, where the header (and so the
// brand) is hidden.
const ResumePage: FunctionComponent = () => (
  <PageContainer title="Résumé" documentTitle={toDocumentTitle("Résumé")}>
    <div className="resume-page">
      <p className="resume-page__print-name">{OWNER_NAME}</p>
      <div className="resume-page__download">
        <Button
          href={RESUME_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          size="xlg"
          width="auto"
          text="Download PDF"
        />
      </div>
      <ResumeDisplay />
    </div>
  </PageContainer>
);

export default ResumePage;
