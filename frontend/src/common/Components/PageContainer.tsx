import {
  type FunctionComponent,
  type PropsWithChildren,
  useEffect,
  useRef,
} from "react";

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

// The heading of the page the app loaded with. That page keeps the
// browser's own scroll and focus; StrictMode's replayed effect sees the
// same element, so it can't count as a second page.
let firstHeading: HTMLHeadingElement | undefined;

// A page that mounts after the first scrolls to the top and focuses its
// heading, so screen readers announce it; tabIndex={-1} keeps the heading
// out of the tab order. A new path that keeps the page mounted (e.g. a
// project's dialog at /work/:slug) leaves both alone.
const PageContainer: FunctionComponent<Props> = ({
  title,
  documentTitle,
  children,
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = headingRef.current!;
    firstHeading ??= heading;
    if (heading === firstHeading) return;

    window.scrollTo(0, 0);
    heading.focus({ preventScroll: true });
  }, []);

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
