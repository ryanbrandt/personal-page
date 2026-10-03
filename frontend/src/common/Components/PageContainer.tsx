import type { FunctionComponent, PropsWithChildren } from "react";

const SITE_NAME = "Ryan Brandt";

interface BaseProps {
  /** The page's heading, its one `<h1>` */
  title: string;

  /**
   * The page's name in the browser tab, before the site name. Omit it on
   * the home page, whose tab shows the site name and role alone.
   */
  documentTitle?: string;
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
    <title>
      {documentTitle
        ? `${documentTitle} | ${SITE_NAME}`
        : `${SITE_NAME} | Software Engineer`}
    </title>
    <h1 tabIndex={-1} className="page-container__title">
      {title}
    </h1>
    {children}
  </div>
);

export default PageContainer;
