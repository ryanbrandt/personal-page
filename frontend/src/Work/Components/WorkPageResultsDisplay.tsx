import { FunctionComponent } from "react";
import { useSelector } from "react-redux";

import WorkPageResult from "@app/Work/Subcomponents/WorkPageResult";
import { selectFilteredWorkEntries } from "@app/Work/memoizedSelectors";

const WorkPageResultsDisplay: FunctionComponent = (): JSX.Element => {
  const filteredWorkEntries = useSelector(selectFilteredWorkEntries);

  return (
    <div className="work-page__results-display">
      {filteredWorkEntries.map((entry) => (
        <WorkPageResult key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default WorkPageResultsDisplay;
