import type { FunctionComponent } from "react";

import PageContainer from "@app/common/Components/PageContainer";
import { toDocumentTitle } from "@app/common/utils/documentTitle";
import WorkPageSearchFilters from "@app/Work/Components/WorkPageSearchFilters";
import WorkPageResultsDisplay from "@app/Work/Components/WorkPageResultsDisplay";

const WorkPage: FunctionComponent = () => (
  <PageContainer
    title="Recent Personal Projects"
    documentTitle={toDocumentTitle("Projects")}
  >
    <div className="work-page">
      <WorkPageSearchFilters />
      <WorkPageResultsDisplay />
    </div>
  </PageContainer>
);

export default WorkPage;
