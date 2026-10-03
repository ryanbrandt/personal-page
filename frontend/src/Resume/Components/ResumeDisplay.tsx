import type { FunctionComponent } from "react";

import PageSection from "@app/common/Components/PageSection";
import Timeline from "@app/common/Components/Timeline";
import ResumeEntry from "@app/Resume/Subcomponents/ResumeEntry";
import ResumeSkillGroup from "@app/Resume/Subcomponents/ResumeSkillGroup";
import {
  WORK_ENTRIES,
  EDUCATION_ENTRIES,
  SKILL_GROUPS,
} from "@app/repositories/resume";

const TIMELINE_SECTIONS = [
  { title: "Experience", entries: WORK_ENTRIES },
  { title: "Education", entries: EDUCATION_ENTRIES },
] as const;

const ResumeDisplay: FunctionComponent = () => (
  <div className="resume-page__display">
    {TIMELINE_SECTIONS.map(({ title, entries }) => (
      <PageSection key={title} title={title}>
        <Timeline>
          {entries.map((entry) => (
            <ResumeEntry key={entry.id} entry={entry} />
          ))}
        </Timeline>
      </PageSection>
    ))}
    <PageSection title="Skills">
      <div className="resume-page__skill-groups">
        {SKILL_GROUPS.map((group) => (
          <ResumeSkillGroup key={group.name} group={group} />
        ))}
      </div>
    </PageSection>
  </div>
);

export default ResumeDisplay;
