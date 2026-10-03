/**
 * A date range for display, e.g. "April 2021 – September 2021", or
 * "September 2021 – Present" while it's ongoing (`end` is null).
 *
 * Takes the dates as stored and returns them as shown: the one place that
 * changes when the content moves to ISO dates (R8).
 */
export const formatDateRange = (start: string, end: string | null): string =>
  `${start} – ${end ?? "Present"}`;
