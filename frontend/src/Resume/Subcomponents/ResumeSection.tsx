import type { FunctionComponent, PropsWithChildren } from "react";
import { Heading } from "@ryanbrandt/react-quick-ui";

interface BaseProps {
  title: string;
}

type Props = PropsWithChildren<BaseProps>;

const ResumeSection: FunctionComponent<Props> = ({ title, children }) => (
  <section className="resume-page__section">
    <Heading variant="section" text={title} />
    <div className="resume-page__section__content">{children}</div>
  </section>
);

export default ResumeSection;
