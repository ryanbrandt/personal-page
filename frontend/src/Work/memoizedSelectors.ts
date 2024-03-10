import { createSelector } from "@reduxjs/toolkit";

import { selectWorkQuery, selectWorkEntries } from "@app/Work/selectors";

export const selectFilteredWorkEntries = createSelector(
  [selectWorkEntries, selectWorkQuery],
  (entries, query) => {
    const cleanedQuery = query.toLowerCase();

    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(cleanedQuery) ||
        e.description.toLowerCase().includes(cleanedQuery)
    );
  }
);
