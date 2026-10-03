import { createSlice } from "@reduxjs/toolkit";

import type { IWorkSlice } from "@app/Work/types";
import { WORK_ENTRIES } from "@app/repositories/work";

export const WORK_SLICE_NAME = "work";

// The projects only; the page's filters live in the URL (see Work/hooks.ts).
const initialState: IWorkSlice = {
  entries: WORK_ENTRIES,
};

const workSlice = createSlice({
  name: WORK_SLICE_NAME,
  initialState,
  reducers: {},
});

export default workSlice.reducer;
