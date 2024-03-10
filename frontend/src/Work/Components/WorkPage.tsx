import { FunctionComponent } from "react";

import PageContainer from "@app/common/Components/PageContainer";
import WorkPageSearchFilters from "@app/Work/Components/WorkPageSearchFilters";
import WorkPageResultsDisplay from "@app/Work/Components/WorkPageResultsDisplay";

const WorkPage: FunctionComponent = (): JSX.Element => (
  <PageContainer title="Recent Personal Projects">
    <div className="work-page">
      <WorkPageSearchFilters />
      <WorkPageResultsDisplay />
    </div>
  </PageContainer>
);

export default WorkPage;
