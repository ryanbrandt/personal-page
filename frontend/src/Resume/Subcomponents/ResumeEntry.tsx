import type { FunctionComponent } from "react";

import TimelineEntry from "@app/common/Components/TimelineEntry";
import type { IResumeEntry } from "@app/content/types";

interface Props {
  entry: IResumeEntry;
}

const ResumeEntry: FunctionComponent<Props> = ({
  entry: { title, organization, start, end, description, highlights },
}) => (
  <TimelineEntry
    title={title}
    organization={organization}
    start={start}
    end={end}
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
