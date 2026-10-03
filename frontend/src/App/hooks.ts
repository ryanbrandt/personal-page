import { useState } from "react";
import type { ThemePreference } from "@ryanbrandt/react-quick-ui";

import {
  applyThemePreference,
  getThemePreference,
} from "@app/common/utils/theme";

/**
 * The theme preference and a setter that applies and stores a new one.
 * `data-theme` on `<html>` is the source of truth (index.html sets it before
 * React mounts); this state only mirrors it for rendering.
 */
export const useThemePreference = (): [
  ThemePreference,
  (preference: ThemePreference) => void,
] => {
  const [preference, setPreference] = useState(getThemePreference);

  const choosePreference = (next: ThemePreference) => {
    applyThemePreference(next);
    setPreference(next);
  };

  return [preference, choosePreference];
};
