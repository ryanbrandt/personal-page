import type { FunctionComponent } from "react";
import { Button } from "@ryanbrandt/react-quick-ui";

import PageContainer from "@app/common/Components/PageContainer";
import { RESUME_PDF_URL } from "@app/common/constants/urls";
import { toDocumentTitle } from "@app/common/utils/documentTitle";
import ResumeDisplay from "@app/Resume/Components/ResumeDisplay";

const ResumePage: FunctionComponent = () => (
  <PageContainer title="Résumé" documentTitle={toDocumentTitle("Résumé")}>
    <div className="resume-page">
      <div className="resume-page__download">
        <Button
          href={RESUME_PDF_URL}
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
