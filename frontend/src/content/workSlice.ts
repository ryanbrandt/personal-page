import { createSelector, createSlice } from "@reduxjs/toolkit";

import { CONTENT } from "@app/content";
import type { IWorkEntry } from "@app/content/types";
import type { RootState } from "@app/store";

export const WORK_SLICE_NAME = "work";

interface IWorkSlice {
  entries: ReadonlyArray<IWorkEntry>;
}

// The projects only; the projects page's filters live in the URL (see
// Work/hooks.ts).
const initialState: IWorkSlice = {
  entries: CONTENT.projects,
};

const workSlice = createSlice({
  name: WORK_SLICE_NAME,
  initialState,
  reducers: {},
});

export const selectWorkEntries = (state: RootState) => state.work.entries;

export const selectWorkEntryBySlug = (state: RootState, slug: string) =>
  state.work.entries.find((entry) => entry.slug === slug);

/** Every project tag, once each, in alphabetical order. */
export const selectWorkTags = createSelector([selectWorkEntries], (entries) =>
  [...new Set(entries.flatMap(({ tags }) => tags))].sort((a, b) =>
    a.localeCompare(b)
  )
);

/** The projects, the most recently started first. */
export const selectNewestWorkEntriesFirst = createSelector(
  [selectWorkEntries],
  (entries) =>
    // ISO months ("2021-09") sort as text.
    entries.toSorted((a, b) => b.start.localeCompare(a.start))
);

export default workSlice.reducer;
