import type { FunctionComponent, PropsWithChildren } from "react";

import MobileContext from "@app/common/contexts/MobileContext";
import { useIsMobile } from "@app/App/hooks";

const AppContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}: PropsWithChildren) => {
  const isMobile = useIsMobile();

  return (
    <MobileContext.Provider value={isMobile}>{children}</MobileContext.Provider>
  );
};

export default AppContextProvider;
