import { Theme } from "@app/common/constants/themes";
import { useWindowSize } from "@ryanbrandt/react-quick-ui";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectManualAppThemePreference } from "./selectors";

export const MOBILE_WIDTH_UPPER_BOUND = 1024;

export const useIsMobile = (): boolean => {
  const { innerWidth } = useWindowSize();

  if (innerWidth > MOBILE_WIDTH_UPPER_BOUND) {
    return false;
  }

  return true;
};

export const useAppTheme = (): Theme => {
  const manualThemePreference = useSelector(selectManualAppThemePreference);
  const [theme, setTheme] = useState(Theme.LIGHT);

  useEffect(() => {
    const darkModePreferenceRequest = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    setTheme(darkModePreferenceRequest.matches ? Theme.DARK : Theme.LIGHT);

    const darkModePreferenceChangeListener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? Theme.DARK : Theme.LIGHT);
    };
    darkModePreferenceRequest.addEventListener(
      "change",
      darkModePreferenceChangeListener
    );

    return () =>
      darkModePreferenceRequest.removeEventListener(
        "change",
        darkModePreferenceChangeListener
      );
  }, []);

  useEffect(() => {
    if (manualThemePreference) {
      setTheme(manualThemePreference);
    }
  }, [manualThemePreference]);

  return theme;
};
