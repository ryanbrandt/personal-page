import type { FunctionComponent } from "react";

import { CONTENT_ID } from "@app/App/constants";
import ApplicationRoutes from "@app/routes";

// tabIndex={-1}: the skip link can focus it, but Tab doesn't stop on it.
const ContentContainer: FunctionComponent = () => (
  <main id={CONTENT_ID} tabIndex={-1} className="content-container">
    <ApplicationRoutes />
  </main>
);

export default ContentContainer;
