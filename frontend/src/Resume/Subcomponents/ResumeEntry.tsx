import type { FunctionComponent } from "react";

import TimelineEntry from "@app/common/Components/TimelineEntry";
import { toDateRange } from "@app/Resume/utils";
import type { IResumeEntry } from "@app/types/resume";

interface Props {
  entry: IResumeEntry;
}

const ResumeEntry: FunctionComponent<Props> = ({ entry }) => (
  <TimelineEntry
    title={entry.title}
    organization={entry.organization}
    dates={toDateRange(entry)}
  >
    <p className="resume-page__entry-summary">{entry.description}</p>
    {entry.highlights.length > 0 && (
      <ul className="resume-page__entry-highlights">
        {entry.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    )}
  </TimelineEntry>
);

export default ResumeEntry;
