import type { FunctionComponent } from "react";

import Timeline from "@app/common/Components/Timeline";
import ResumeEntry from "@app/Resume/Subcomponents/ResumeEntry";
import ResumeSection from "@app/Resume/Subcomponents/ResumeSection";
import ResumeSkillGroup from "@app/Resume/Subcomponents/ResumeSkillGroup";
import {
  WORK_ENTRIES,
  EDUCATION_ENTRIES,
  SKILL_GROUPS,
} from "@app/repositories/resume";

const ResumeDisplay: FunctionComponent = () => (
  <div className="resume-page__display">
    <ResumeSection title="Experience">
      <Timeline>
        {WORK_ENTRIES.map((entry) => (
          <ResumeEntry key={entry.id} entry={entry} />
        ))}
      </Timeline>
    </ResumeSection>
    <ResumeSection title="Education">
      <Timeline>
        {EDUCATION_ENTRIES.map((entry) => (
          <ResumeEntry key={entry.id} entry={entry} />
        ))}
      </Timeline>
    </ResumeSection>
    <ResumeSection title="Skills">
      <div className="resume-page__skill-groups">
        {SKILL_GROUPS.map((group) => (
          <ResumeSkillGroup key={group.name} group={group} />
        ))}
      </div>
    </ResumeSection>
  </div>
);

export default ResumeDisplay;
