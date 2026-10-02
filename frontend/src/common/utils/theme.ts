import type { ThemePreference } from "@ryanbrandt/react-quick-ui";

// The inline script in index.html applies the stored preference before the
// page first renders (so it never flashes the wrong theme). It repeats this
// module's logic because it runs before any bundle loads: keep the two in sync.

const THEME_STORAGE_KEY = "theme";
const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";
const THEME_PREFERENCES: ReadonlyArray<string> = ["light", "dark", "system"];

const isThemePreference = (value?: string | null): value is ThemePreference =>
  value != null && THEME_PREFERENCES.includes(value);

/** The preference the inline script applied to `<html>` on load. */
export const getAppliedThemePreference = (): ThemePreference => {
  const { theme } = document.documentElement.dataset;
  return isThemePreference(theme) ? theme : DEFAULT_THEME_PREFERENCE;
};

/** Whether `preference` currently shows the dark theme. */
export const isDarkTheme = (preference: ThemePreference): boolean =>
  preference === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : preference === "dark";

// index.html has one `<meta name="theme-color">` per scheme. "system" lets
// each follow the OS; an explicit choice enables only its own.
const themeColorMedia = (
  scheme: string | undefined,
  preference: ThemePreference
): string => {
  if (preference === "system") {
    return `(prefers-color-scheme: ${scheme})`;
  }
  return scheme === preference ? "all" : "not all";
};

/**
 * Themes the page (the library's tokens follow `data-theme` on `<html>`),
 * points `<meta name="theme-color">` at the matching scheme and remembers the
 * choice for the next visit.
 */
export const applyThemePreference = (preference: ThemePreference): void => {
  document.documentElement.dataset.theme = preference;

  document
    .querySelectorAll<HTMLMetaElement>("meta[data-color-scheme]")
    .forEach((meta) => {
      meta.media = themeColorMedia(meta.dataset.colorScheme, preference);
    });

  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage can be unavailable (e.g. blocked); the choice lasts this visit.
  }
};
