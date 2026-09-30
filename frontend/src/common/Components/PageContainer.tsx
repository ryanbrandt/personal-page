import type { FunctionComponent, PropsWithChildren } from "react";

interface BaseProps {
  title: string;
}

type Props = PropsWithChildren<BaseProps>;

const PageContainer: FunctionComponent<Props> = ({
  title,
  children,
}: Props) => (
  <div className="page-container">
    <h2 className="page-container__title">{title}</h2>
    {children}
  </div>
);

export default PageContainer;
