import type { ThemePreference } from "@ryanbrandt/react-quick-ui";

export const THEME_STORAGE_KEY = "theme";

/**
 * Themes the page: sets `data-theme` on `<html>` (the library's tokens follow
 * it) and points `<meta name="theme-color">` at the matching scheme. With a
 * `preference`, also stores it; without one, applies the stored preference
 * (default "system").
 *
 * vite.config.ts inlines this function's source into index.html, where it runs
 * before the page first renders so a stored preference never flashes the
 * wrong theme. So it must stay self-contained: no references to anything
 * outside its body, only plain JavaScript once the types are stripped.
 */
export function applyTheme(
  storageKey: string,
  preference?: ThemePreference
): void {
  const preferences = ["light", "dark", "system"];
  let applied: ThemePreference = preference ?? "system";

  try {
    if (preference) {
      localStorage.setItem(storageKey, preference);
    } else {
      const stored = localStorage.getItem(storageKey);
      if (stored && preferences.includes(stored)) {
        applied = stored as ThemePreference;
      }
    }
  } catch {
    // Storage can be unavailable (e.g. blocked); the choice lasts this visit.
  }

  document.documentElement.dataset.theme = applied;

  // One theme-color meta per scheme: "system" lets each follow the OS, an
  // explicit choice enables only its own.
  document
    .querySelectorAll<HTMLMetaElement>("meta[data-color-scheme]")
    .forEach((meta) => {
      const scheme = meta.dataset.colorScheme;
      if (applied === "system") {
        meta.media = `(prefers-color-scheme: ${scheme})`;
      } else {
        meta.media = scheme === applied ? "all" : "not all";
      }
    });
}

/** Themes the page with `preference` and stores it for the next visit. */
export const applyThemePreference = (preference: ThemePreference): void =>
  applyTheme(THEME_STORAGE_KEY, preference);

/** The preference the page currently shows: its `data-theme` on `<html>`. */
export const getThemePreference = (): ThemePreference => {
  const { theme } = document.documentElement.dataset;
  return theme === "light" || theme === "dark" ? theme : "system";
};
