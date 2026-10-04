import { useState, useSyncExternalStore } from "react";
import type { ThemePreference } from "@ryanbrandt/react-quick-ui";

import {
  applyThemePreference,
  getThemePreference,
} from "@app/common/utils/theme";

/** A theme the page can show: "system" resolved to the OS's scheme. */
export type ShownTheme = Exclude<ThemePreference, "system">;

const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const subscribeToOsScheme = (onChange: () => void) => {
  const query = window.matchMedia(DARK_SCHEME_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const osPrefersDark = () => window.matchMedia(DARK_SCHEME_QUERY).matches;

/**
 * The theme the page shows and a setter that applies and stores a choice.
 * Until the user chooses, the page follows the OS ("system"), and the shown
 * theme follows OS changes live. `data-theme` on `<html>` is the source of
 * truth (index.html sets it before React mounts); this state only mirrors
 * it for rendering.
 */
export const useShownTheme = (): [
  ShownTheme,
  (theme: ThemePreference) => void,
] => {
  const [preference, setPreference] = useState(getThemePreference);
  const prefersDark = useSyncExternalStore(subscribeToOsScheme, osPrefersDark);

  const choose = (theme: ThemePreference) => {
    applyThemePreference(theme);
    setPreference(theme);
  };

  const shown =
    preference === "system" ? (prefersDark ? "dark" : "light") : preference;
  return [shown, choose];
};
