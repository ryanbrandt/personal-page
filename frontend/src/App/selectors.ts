import { RootState } from "@app/store";
import { useSelector } from "react-redux";

export const selectManualAppThemePreference = (state: RootState) =>
  state.app.manualThemePreference;
