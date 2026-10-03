import type { FunctionComponent } from "react";

import AppHeader from "@app/App/Components/AppHeader";
import ContentContainer from "@app/App/Components/ContentContainer";
import { CONTENT_ID } from "@app/App/constants";
import AppFooter from "@app/App/Subcomponents/AppFooter";

const RootContainer: FunctionComponent = () => (
  <div className="root-container">
    <a href={`#${CONTENT_ID}`} className="root-container__skip-link">
      Skip to content
    </a>
    <AppHeader />
    <ContentContainer />
    <AppFooter />
  </div>
);

export default RootContainer;
