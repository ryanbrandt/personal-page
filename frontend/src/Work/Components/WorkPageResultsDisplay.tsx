import type { FunctionComponent } from "react";

import WorkPageResult from "@app/Work/Subcomponents/WorkPageResult";
import { selectFilteredWorkEntries } from "@app/Work/memoizedSelectors";
import { useAppSelector } from "@app/store/hooks";

const WorkPageResultsDisplay: FunctionComponent = () => {
  const filteredWorkEntries = useAppSelector(selectFilteredWorkEntries);

  return (
    <div className="work-page__results-display">
      {filteredWorkEntries.map((entry) => (
        <WorkPageResult key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default WorkPageResultsDisplay;
