import { type FunctionComponent, type PropsWithChildren, useRef } from "react";

import { useFocusHeadingOnPageMount } from "@app/common/hooks";

interface BaseProps {
  /** The page's heading, its one `<h1>` */
  title: string;

  /**
   * The page's browser tab title: `toDocumentTitle(…)` from
   * common/utils/documentTitle.ts
   */
  documentTitle: string;
}

type Props = PropsWithChildren<BaseProps>;

// Every routed page renders this (or uses useFocusHeadingOnPageMount on its
// own <h1>): its heading takes focus when a new page mounts, so screen
// readers announce it; tabIndex={-1} keeps the heading out of the tab order.
const PageContainer: FunctionComponent<Props> = ({
  title,
  documentTitle,
  children,
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useFocusHeadingOnPageMount(headingRef);

  return (
    <div className="page-container">
      <title>{documentTitle}</title>
      <h1 ref={headingRef} tabIndex={-1} className="page-container__title">
        {title}
      </h1>
      {children}
    </div>
  );
};

export default PageContainer;
