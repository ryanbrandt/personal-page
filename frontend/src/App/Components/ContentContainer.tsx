import { FunctionComponent, JSX } from "react";

import ApplicationRoutes from "@app/routes";

const ContentContainer: FunctionComponent = (): JSX.Element => (
  <div className="content-container">
    <ApplicationRoutes />
  </div>
);

export default ContentContainer;
