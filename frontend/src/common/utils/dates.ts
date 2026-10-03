/**
 * A date range for display, e.g. "April 2021 – September 2021", or
 * "September 2021 – Present" while it's ongoing (`end` is null).
 *
 * Takes the dates as stored and returns them as shown: the one place that
 * changes when the content moves to ISO dates (R8).
 *
 * R8: parse the ISO year and month yourself, or format with
 * `timeZone: "UTC"`. `new Date("2021-09")` is midnight UTC, which is still
 * August in US time zones, so formatting it in local time shows the
 * previous month.
 */
export const formatDateRange = (start: string, end: string | null): string =>
  `${start} – ${end ?? "Present"}`;
