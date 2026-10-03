import type { FunctionComponent } from "react";

import TimelineEntry from "@app/common/Components/TimelineEntry";
import type { IResumeEntry } from "@app/types/resume";

interface Props {
  entry: IResumeEntry;
}

const ResumeEntry: FunctionComponent<Props> = ({
  entry: { title, organization, startDate, endDate, description, highlights },
}) => (
  <TimelineEntry
    title={title}
    organization={organization}
    startDate={startDate}
    endDate={endDate}
  >
    <p className="resume-page__entry-summary">{description}</p>
    {highlights.length > 0 && (
      <ul className="resume-page__entry-highlights">
        {highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    )}
  </TimelineEntry>
);

export default ResumeEntry;
