import type { FunctionComponent, PropsWithChildren } from "react";

/**
 * A vertical timeline with a rule down its left side. Its children are
 * `TimelineEntry`s, newest first.
 */
// role="list": Safari drops list semantics under `list-style: none`.
const Timeline: FunctionComponent<PropsWithChildren> = ({ children }) => (
  // eslint-disable-next-line jsx-a11y-x/no-redundant-roles
  <ol role="list" className="timeline">
    {children}
  </ol>
);

export default Timeline;
