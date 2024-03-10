import { FunctionComponent, useContext } from "react";

import ThemeToggleSvg from "@app/assets/svg/ThemeToggleSvg";
import { useDispatch } from "react-redux";
import ThemeContext from "@app/common/contexts/ThemeContext";
import { manualThemePreferenceChange } from "../slice";
import { Theme } from "@app/common/constants/themes";

const AppHeaderThemeToggle: FunctionComponent = (): JSX.Element => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  const onThemeToggleClick = () => {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    dispatch(manualThemePreferenceChange(newTheme));
  };

  return (
    <div className="app-header__theme-toggle" onClick={onThemeToggleClick}>
      <ThemeToggleSvg />
    </div>
  );
};

export default AppHeaderThemeToggle;
