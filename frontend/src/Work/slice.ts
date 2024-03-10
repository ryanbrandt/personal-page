/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IWorkSlice } from "@app/Work/types";
import { WORK_ENTRIES } from "@app/repositories/work";

export const WORK_SLICE_NAME = "work";

const initialState: IWorkSlice = {
  entries: [...WORK_ENTRIES],
  query: "",
};

const workSlice = createSlice({
  name: WORK_SLICE_NAME,
  initialState,
  reducers: {
    workQueryChange: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
});

export const { workQueryChange } = workSlice.actions;

export default workSlice.reducer;
