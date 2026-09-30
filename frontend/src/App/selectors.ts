import type { RootState } from "@app/store";

export const selectManualAppThemePreference = (state: RootState) =>
  state.app.manualThemePreference;
