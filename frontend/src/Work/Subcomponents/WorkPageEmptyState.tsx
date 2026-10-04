import type { FunctionComponent } from "react";
import { Button } from "@ryanbrandt/react-quick-ui";

interface Props {
  onClearFilters: () => void;
}

const WorkPageEmptyState: FunctionComponent<Props> = ({ onClearFilters }) => (
  <div className="work-page__empty">
    <p>No projects match these filters.</p>
    <Button
      text="Clear filters"
      variant="secondary"
      size="xlg"
      width="auto"
      onClick={onClearFilters}
    />
  </div>
);

export default WorkPageEmptyState;
