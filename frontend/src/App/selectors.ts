import type { RootState } from "@app/store";

export const selectThemePreference = (state: RootState) =>
  state.app.themePreference;
