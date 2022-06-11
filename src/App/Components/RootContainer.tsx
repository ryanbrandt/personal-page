import { FunctionComponent } from "react";

import AppHeader from "@app/App/Components/AppHeader";
import MobileContext from "@app/common/contexts/MobileContext";
import ContentContainer from "@app/App/Components/ContentContainer";
import { useIsMobile } from "@app/App/hooks";

const RootContainer: FunctionComponent = (): JSX.Element => {
  const isMobile = useIsMobile();

  return (
    <MobileContext.Provider value={isMobile}>
      <AppHeader />
      <ContentContainer />
    </MobileContext.Provider>
  );
};

export default RootContainer;
