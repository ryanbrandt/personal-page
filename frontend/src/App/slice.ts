import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { IAppSlice } from "@app/App/types";
import type { Theme } from "@app/common/constants/themes";

export const APP_SLICE_NAME = "app";

const initialState: IAppSlice = {
  manualThemePreference: undefined,
};

const appSlice = createSlice({
  name: APP_SLICE_NAME,
  initialState,
  reducers: {
    manualThemePreferenceChange: (state, action: PayloadAction<Theme>) => {
      state.manualThemePreference = action.payload;
    },
  },
});

export const { manualThemePreferenceChange } = appSlice.actions;

export default appSlice.reducer;
