import { createSlice } from "@reduxjs/toolkit";

import type { IWorkSlice } from "@app/Work/types";
import { contentSource } from "@app/content/source";

export const WORK_SLICE_NAME = "work";

// The projects only; the page's filters live in the URL (see Work/hooks.ts).
// With a content API, this slice gives way to its RTK Query endpoints.
const initialState: IWorkSlice = {
  entries: contentSource.getProjects(),
};

const workSlice = createSlice({
  name: WORK_SLICE_NAME,
  initialState,
  reducers: {},
});

export default workSlice.reducer;
