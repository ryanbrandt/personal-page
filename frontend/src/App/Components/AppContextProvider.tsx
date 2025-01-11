import { FunctionComponent, JSX, PropsWithChildren } from "react";

import MobileContext from "@app/common/contexts/MobileContext";
import { useAppTheme, useIsMobile } from "@app/App/hooks";
import ThemeContext from "@app/common/contexts/ThemeContext";

const AppContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const isMobile = useIsMobile();
  const theme = useAppTheme();

  return (
    <MobileContext.Provider value={isMobile}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </MobileContext.Provider>
  );
};

export default AppContextProvider;
