import type { FunctionComponent } from "react";

import PageSection from "@app/common/Components/PageSection";
import Timeline from "@app/common/Components/Timeline";
import { useEducation, useExperience, useSkills } from "@app/content/hooks";
import ResumeEntry from "@app/Resume/Subcomponents/ResumeEntry";
import ResumeSkillGroup from "@app/Resume/Subcomponents/ResumeSkillGroup";

const ResumeDisplay: FunctionComponent = () => {
  const timelineSections = [
    { title: "Experience", entries: useExperience() },
    { title: "Education", entries: useEducation() },
  ];
  const skillGroups = useSkills();

  return (
    <div className="resume-page__display">
      {timelineSections.map(({ title, entries }) => (
        <PageSection key={title} title={title}>
          <Timeline>
            {entries.map((entry) => (
              <ResumeEntry
                key={`${entry.start} ${entry.title}`}
                entry={entry}
              />
            ))}
          </Timeline>
        </PageSection>
      ))}
      <PageSection title="Skills">
        <div className="resume-page__skill-groups">
          {skillGroups.map((group) => (
            <ResumeSkillGroup key={group.name} group={group} />
          ))}
        </div>
      </PageSection>
    </div>
  );
};

export default ResumeDisplay;
