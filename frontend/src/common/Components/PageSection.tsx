import type { FunctionComponent, PropsWithChildren } from "react";
import { Heading } from "@ryanbrandt/react-quick-ui";

interface BaseProps {
  /** The section's `<h2>` */
  title: string;
}

type Props = PropsWithChildren<BaseProps>;

/**
 * A page section laid out as in D0: the heading in the first of three
 * columns and the content across the other two; stacked on narrow screens
 * and in print.
 */
const PageSection: FunctionComponent<Props> = ({ title, children }) => (
  <section className="page-section">
    <Heading variant="section" text={title} />
    <div className="page-section__content">{children}</div>
  </section>
);

export default PageSection;
