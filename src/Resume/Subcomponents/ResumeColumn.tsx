import { FunctionComponent, PropsWithChildren } from "react";

interface BaseProps {
  title: string;
}

type Props = PropsWithChildren<BaseProps>;

const ResumeColumn: FunctionComponent<Props> = ({
  title,
  children,
}: Props): JSX.Element => (
  <div className="resume-page__resume-display__column">
    <h2>{title}</h2>
    {children}
  </div>
);

export default ResumeColumn;
