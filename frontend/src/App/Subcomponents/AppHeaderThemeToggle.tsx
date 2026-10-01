import { type FunctionComponent, useContext } from "react";

import { manualThemePreferenceChange } from "@app/App/slice";
import ThemeToggleSvg from "@app/assets/svg/ThemeToggleSvg";
import { Theme } from "@app/common/constants/themes";
import ThemeContext from "@app/common/contexts/ThemeContext";
import { useAppDispatch } from "@app/store/hooks";

const AppHeaderThemeToggle: FunctionComponent = () => {
  const theme = useContext(ThemeContext);
  const dispatch = useAppDispatch();

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
