import { createSelector } from "@reduxjs/toolkit";

import { RECENT_PROJECT_COUNT } from "@app/Work/constants";
import { selectWorkEntries } from "@app/Work/selectors";

/** Every project tag, once each, in alphabetical order. */
export const selectWorkTags = createSelector([selectWorkEntries], (entries) =>
  [...new Set(entries.flatMap(({ tags }) => tags))].sort((a, b) =>
    a.localeCompare(b)
  )
);

/** The projects started most recently, newest first. */
export const selectRecentWorkEntries = createSelector(
  [selectWorkEntries],
  (entries) =>
    // ISO months ("2021-09") sort as text.
    entries
      .toSorted((a, b) => b.start.localeCompare(a.start))
      .slice(0, RECENT_PROJECT_COUNT)
);
