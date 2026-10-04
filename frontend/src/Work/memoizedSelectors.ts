import { createSelector } from "@reduxjs/toolkit";

import { toMonthNumber } from "@app/common/utils/dates";
import { RECENT_PROJECT_COUNT } from "@app/Work/constants";
import { selectWorkEntries } from "@app/Work/selectors";

/** Every project tag, once each, in alphabetical order. */
export const selectWorkTags = createSelector([selectWorkEntries], (entries) =>
  [...new Set(entries.flatMap(({ tags }) => tags))].sort((a, b) =>
    a.localeCompare(b)
  )
);

/**
 * The projects started most recently, newest first.
 * TODO(R8): with ISO dates, compare with `localeCompare` (or store the data
 * newest first) and drop toMonthNumber.
 */
export const selectRecentWorkEntries = createSelector(
  [selectWorkEntries],
  (entries) =>
    entries
      .toSorted((a, b) => toMonthNumber(b.start) - toMonthNumber(a.start))
      .slice(0, RECENT_PROJECT_COUNT)
);
