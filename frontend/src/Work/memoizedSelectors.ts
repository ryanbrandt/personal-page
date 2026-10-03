import { createSelector } from "@reduxjs/toolkit";

import { selectWorkEntries } from "@app/Work/selectors";

/** Every project tag, once each, in alphabetical order. */
export const selectWorkTags = createSelector([selectWorkEntries], (entries) =>
  [...new Set(entries.flatMap(({ tags }) => tags))].sort((a, b) =>
    a.localeCompare(b)
  )
);
