import type { FunctionComponent } from "react";

import ThemeToggleSvg from "@app/assets/svg/ThemeToggleSvg";
import {
  applyThemePreference,
  isDarkThemeShown,
} from "@app/common/utils/theme";

// Flips between light and dark; a light/dark/system control comes with R2.
const AppHeaderThemeToggle: FunctionComponent = () => (
  <div
    className="app-header__theme-toggle"
    onClick={() => applyThemePreference(isDarkThemeShown() ? "light" : "dark")}
  >
    <ThemeToggleSvg />
  </div>
);

export default AppHeaderThemeToggle;
