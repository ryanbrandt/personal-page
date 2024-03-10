import { FunctionComponent } from "react";
import { Badge } from "@ryanbrandt/react-quick-ui";

import ResumeWorkEntry from "@app/Resume/Subcomponents/ResumeEntry";
import ResumeColumn from "@app/Resume/Subcomponents/ResumeColumn";
import SuitcaseSvg from "@app/assets/svg/SuitcaseSvg";
import GraduationCapSvg from "@app/assets/svg/GraduationCapSvg";
import {
  WORK_ENTRIES,
  EDUCATION_ENTRIES,
  SKILL_ENTRIES,
} from "@app/repositories/resume";

const ResumeDisplay: FunctionComponent = (): JSX.Element => (
  <div className="resume-page__resume-display">
    <ResumeColumn title="Experience">
      {WORK_ENTRIES.map((entry) => (
        <ResumeWorkEntry icon={<SuitcaseSvg />} key={entry.id} entry={entry} />
      ))}
    </ResumeColumn>
    <ResumeColumn title="Education">
      {EDUCATION_ENTRIES.map((entry) => (
        <ResumeWorkEntry
          icon={<GraduationCapSvg />}
          key={entry.id}
          entry={entry}
        />
      ))}
    </ResumeColumn>
    <ResumeColumn title="Skills">
      <div className="resume-page__resume-display__column__skills">
        {SKILL_ENTRIES.map(({ name, id }) => (
          <Badge
            key={`${name}-${id}`}
            size="fit-content"
            variant="primary"
            text={name}
          />
        ))}
      </div>
    </ResumeColumn>
  </div>
);

export default ResumeDisplay;
