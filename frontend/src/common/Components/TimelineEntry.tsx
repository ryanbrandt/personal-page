import type { FunctionComponent, PropsWithChildren } from "react";

interface BaseProps {
  /** The role, degree or other title: the entry's `<h3>` */
  title: string;

  /** Where: the company, school or other organization */
  organization: string;

  /** When, already formatted, e.g. "April 2021 – September 2021" */
  dates: string;
}

/** `children`, if any, are the entry's details, shown below its heading. */
type Props = PropsWithChildren<BaseProps>;

// The dates are shown above the title but come after it in the markup, so
// the heading starts the entry for screen readers and heading navigation.
const TimelineEntry: FunctionComponent<Props> = ({
  title,
  organization,
  dates,
  children,
}) => (
  <li className="timeline__entry">
    <h3 className="timeline__entry__title">{title}</h3>
    <p className="timeline__entry__organization">{organization}</p>
    <p className="timeline__entry__dates">{dates}</p>
    {children && <div className="timeline__entry__details">{children}</div>}
  </li>
);

export default TimelineEntry;
