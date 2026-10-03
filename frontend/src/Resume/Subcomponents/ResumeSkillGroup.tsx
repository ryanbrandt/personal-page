import type { FunctionComponent } from "react";
import { Heading, Tag } from "@ryanbrandt/react-quick-ui";

import type { IResumeSkillGroup } from "@app/types/resume";

interface Props {
  group: IResumeSkillGroup;
}

const ResumeSkillGroup: FunctionComponent<Props> = ({
  group: { name, skills },
}) => (
  <div className="resume-page__skill-group">
    <Heading
      variant="title"
      as="h3"
      text={name}
      className="resume-page__skill-group__title"
    />
    {/* role="list": Safari drops list semantics under `list-style: none`. */}
    {/* eslint-disable-next-line jsx-a11y-x/no-redundant-roles */}
    <ul role="list" className="resume-page__skill-group__skills">
      {skills.map((skill) => (
        <li key={skill}>
          <Tag text={skill} />
        </li>
      ))}
    </ul>
  </div>
);

export default ResumeSkillGroup;
