import type { FunctionComponent } from "react";

import AppHeader from "@app/App/Components/AppHeader";
import ContentContainer from "@app/App/Components/ContentContainer";
import AppFooter from "@app/App/Subcomponents/AppFooter";

const RootContainer: FunctionComponent = () => (
  <div className="root-container">
    <AppHeader />
    <ContentContainer />
    <AppFooter />
  </div>
);

export default RootContainer;
