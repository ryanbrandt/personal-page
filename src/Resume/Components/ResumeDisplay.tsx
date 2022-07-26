import { FunctionComponent } from "react";
import { Badge } from "@ryanbrandt/react-quick-ui";

import { IResumeEntry, IResumeSkill } from "@app/types/resume";
import ResumeWorkEntry from "@app/Resume/Subcomponents/ResumeEntry";
import ResumeColumn from "@app/Resume/Subcomponents/ResumeColumn";
import SuitcaseSvg from "@app/assets/svg/SuitcaseSvg";
import GraduationCapSvg from "@app/assets/svg/GraduationCapSvg";

const MOCK_ENTRIES: Array<IResumeEntry> = [
  {
    id: 1,
    name: "Foo",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    startDate: "01/01/2021",
    endDate: null,
    accomplishments: null,
    created: "01/01/2010",
    modified: "01/01/2010",
    type: "Work",
  },
  {
    id: 2,
    name: "Bar",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    startDate: "01/01/2018",
    endDate: "01/01/2021",
    accomplishments:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    created: "01/01/2010",
    modified: "01/01/2010",
    type: "Education",
  },
];

const MOCK_SKILLS: Array<IResumeSkill> = [
  {
    id: 1,
    name: "Fortnite Dances",
  },
  {
    id: 2,
    name: "Fortnite Dances",
  },
  {
    id: 3,
    name: "Fortnite Dances",
  },
  {
    id: 4,
    name: "Fortnite Dances",
  },
  {
    id: 5,
    name: "Fortnite Dances",
  },
  {
    id: 6,
    name: "Fortnite Dances",
  },
  {
    id: 7,
    name: "Fortnite Dances",
  },
  {
    id: 8,
    name: "Fortnite Dances",
  },
];

const ResumeDisplay: FunctionComponent = (): JSX.Element => {
  const resumeEntries = MOCK_ENTRIES;
  const resumeSkills = MOCK_SKILLS;

  return (
    <div className="resume-page__resume-display">
      <ResumeColumn title="Work">
        {resumeEntries.map((entry) => (
          <ResumeWorkEntry
            icon={<SuitcaseSvg />}
            key={entry.id}
            entry={entry}
          />
        ))}
      </ResumeColumn>
      <ResumeColumn title="Education">
        {resumeEntries.map((entry) => (
          <ResumeWorkEntry
            icon={<GraduationCapSvg />}
            key={entry.id}
            entry={entry}
          />
        ))}
      </ResumeColumn>
      <ResumeColumn title="Skills">
        <div className="resume-page__resume-display__column__skills">
          {resumeSkills.map(({ name, id }) => (
            <Badge
              key={`${name}-${id}`}
              size="xlg"
              variant="primary"
              text={name}
            />
          ))}
        </div>
      </ResumeColumn>
    </div>
  );
};

export default ResumeDisplay;
