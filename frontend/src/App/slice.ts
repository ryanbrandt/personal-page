import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ThemePreference } from "@ryanbrandt/react-quick-ui";

import type { IAppSlice } from "@app/App/types";
import type { AppThunk } from "@app/store";
import {
  applyThemePreference,
  getAppliedThemePreference,
} from "@app/common/utils/theme";

export const APP_SLICE_NAME = "app";

// The page is already themed when the store is created (see index.html), so
// the state starts from what is applied rather than a default of its own.
const initialState: IAppSlice = {
  themePreference: getAppliedThemePreference(),
};

const appSlice = createSlice({
  name: APP_SLICE_NAME,
  initialState,
  reducers: {
    themePreferenceChange: (state, action: PayloadAction<ThemePreference>) => {
      state.themePreference = action.payload;
    },
  },
});

const { themePreferenceChange } = appSlice.actions;

/** Changes the theme: updates the state, themes the page and stores it. */
export const changeThemePreference =
  (preference: ThemePreference): AppThunk =>
  (dispatch) => {
    dispatch(themePreferenceChange(preference));
    applyThemePreference(preference);
  };

export default appSlice.reducer;
