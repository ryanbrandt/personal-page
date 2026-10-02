import type { FunctionComponent } from "react";

import { changeThemePreference } from "@app/App/slice";
import { selectThemePreference } from "@app/App/selectors";
import ThemeToggleSvg from "@app/assets/svg/ThemeToggleSvg";
import { isDarkTheme } from "@app/common/utils/theme";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";

// Flips between light and dark; a light/dark/system control comes with R2.
const AppHeaderThemeToggle: FunctionComponent = () => {
  const themePreference = useAppSelector(selectThemePreference);
  const dispatch = useAppDispatch();

  const onThemeToggleClick = () => {
    const newTheme = isDarkTheme(themePreference) ? "light" : "dark";
    dispatch(changeThemePreference(newTheme));
  };

  return (
    <div className="app-header__theme-toggle" onClick={onThemeToggleClick}>
      <ThemeToggleSvg />
    </div>
  );
};

export default AppHeaderThemeToggle;
