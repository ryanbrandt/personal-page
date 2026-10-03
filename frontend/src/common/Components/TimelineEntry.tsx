import {
  Children,
  type ComponentProps,
  type FunctionComponent,
  type PropsWithChildren,
} from "react";
import { Heading } from "@ryanbrandt/react-quick-ui";

import { formatDateRange } from "@app/common/utils/dates";

type HeadingLevel = NonNullable<ComponentProps<typeof Heading>["as"]>;

interface BaseProps {
  /** The role, degree or other title: the entry's heading */
  title: string;

  /** The title's heading element, to fit the page's outline */
  headingLevel?: HeadingLevel;

  /** Where: the company, school or other organization */
  organization?: string;

  startDate: string;

  /** null while it's ongoing ("Present") */
  endDate: string | null;
}

/** `children`, if any, are the entry's details, shown below its heading. */
type Props = PropsWithChildren<BaseProps>;

// The dates are shown above the title but come after it in the markup, so
// the heading starts the entry for screen readers and heading navigation.
const TimelineEntry: FunctionComponent<Props> = ({
  title,
  headingLevel = "h3",
  organization,
  startDate,
  endDate,
  children,
}) => (
  <li className="timeline__entry">
    <Heading
      variant="title"
      as={headingLevel}
      text={title}
      className="timeline__entry__title"
    />
    {organization && (
      <p className="timeline__entry__organization">{organization}</p>
    )}
    <p className="timeline__entry__dates">
      {formatDateRange(startDate, endDate)}
    </p>
    {Children.toArray(children).length > 0 && (
      <div className="timeline__entry__details">{children}</div>
    )}
  </li>
);

export default TimelineEntry;
