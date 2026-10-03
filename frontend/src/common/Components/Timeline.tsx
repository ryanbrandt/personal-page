import type { FunctionComponent, PropsWithChildren } from "react";

/**
 * A vertical timeline with a rule down its left side. Its children are
 * `TimelineEntry`s, newest first.
 */
const Timeline: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <ol className="timeline">{children}</ol>
);

export default Timeline;
