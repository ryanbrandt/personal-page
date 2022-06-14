import { FunctionComponent } from "react";

import AppHeader from "@app/App/Components/AppHeader";
import MobileContext from "@app/common/contexts/MobileContext";
import ContentContainer from "@app/App/Components/ContentContainer";
import { useIsMobile } from "@app/App/hooks";
import AppFooter from "@app/App/Subcomponents/AppFooter";

const RootContainer: FunctionComponent = (): JSX.Element => {
  const isMobile = useIsMobile();

  return (
    <div className="root-container">
      <MobileContext.Provider value={isMobile}>
        <AppHeader />
        <ContentContainer />
        <AppFooter />
      </MobileContext.Provider>
    </div>
  );
};

export default RootContainer;
