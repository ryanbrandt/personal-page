import { FunctionComponent, JSX } from "react";

import { IResumeEntry } from "@app/types/resume";

interface Props {
  entry: IResumeEntry;
  icon?: JSX.Element;
}

const ResumeEntry: FunctionComponent<Props> = ({
  entry: { name, description, startDate, endDate, accomplishments },
  icon,
}: Props): JSX.Element => (
  <div className="resume-page__resume-display__column__entry">
    <div className="resume-page__resume-display__column__entry__header">
      {icon}
      <h3>{name}</h3>
    </div>
    <label className="resume-page__resume-display__column__entry__date">
      {startDate} - {endDate || "Present"}
    </label>
    <p>{description}</p>
    {accomplishments && (
      <>
        <label>Accomplishments</label>
        <p>{accomplishments}</p>
      </>
    )}
  </div>
);

export default ResumeEntry;
