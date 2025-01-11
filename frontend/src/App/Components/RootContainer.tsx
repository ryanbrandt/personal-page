import { FunctionComponent, JSX, useContext } from "react";

import AppHeader from "@app/App/Components/AppHeader";
import ContentContainer from "@app/App/Components/ContentContainer";
import AppFooter from "@app/App/Subcomponents/AppFooter";
import ThemeContext from "@app/common/contexts/ThemeContext";
import { Theme } from "@app/common/constants/themes";

const RootContainer: FunctionComponent = (): JSX.Element => {
  const theme = useContext(ThemeContext);

  return (
    <div className={theme === Theme.DARK ? "theme--dark" : "theme--light"}>
      <div className="root-container">
        <AppHeader />
        <ContentContainer />
        <AppFooter />
      </div>
    </div>
  );
};

export default RootContainer;
