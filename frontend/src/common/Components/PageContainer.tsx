import type { FunctionComponent, PropsWithChildren } from "react";

interface BaseProps {
  /** The page's heading, its one `<h1>` */
  title: string;

  /**
   * The page's browser tab title: `HOME_TITLE` or `toDocumentTitle(…)` from
   * common/utils/documentTitle.ts
   */
  documentTitle: string;
}

type Props = PropsWithChildren<BaseProps>;

// The heading takes focus after a route change (see routes/hooks.ts), so
// screen readers announce the new page; tabIndex={-1} keeps it out of the
// tab order.
const PageContainer: FunctionComponent<Props> = ({
  title,
  documentTitle,
  children,
}) => (
  <div className="page-container">
    <title>{documentTitle}</title>
    <h1 tabIndex={-1} className="page-container__title">
      {title}
    </h1>
    {children}
  </div>
);

export default PageContainer;
