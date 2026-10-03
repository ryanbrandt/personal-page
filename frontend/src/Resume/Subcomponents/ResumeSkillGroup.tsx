import type { FunctionComponent } from "react";
import { Tag } from "@ryanbrandt/react-quick-ui";

import type { IResumeSkillGroup } from "@app/types/resume";

interface Props {
  group: IResumeSkillGroup;
}

const ResumeSkillGroup: FunctionComponent<Props> = ({
  group: { name, skills },
}) => (
  <div className="resume-page__skill-group">
    <h3 className="resume-page__skill-group__title">{name}</h3>
    <ul className="resume-page__skill-group__skills">
      {skills.map((skill) => (
        <li key={skill.id}>
          <Tag text={skill.name} />
        </li>
      ))}
    </ul>
  </div>
);

export default ResumeSkillGroup;
