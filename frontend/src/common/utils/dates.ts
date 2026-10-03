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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * A stored date ("May 2022") as a number of months, for ordering: a later
 * month is a larger number. Throws on a date in any other form.
 */
export const toMonthNumber = (date: string): number => {
  const [month = "", year = ""] = date.split(" ");
  const monthIndex = MONTHS.indexOf(month);
  if (monthIndex < 0 || !/^\d{4}$/.test(year)) {
    throw new Error(`Not a "Month YYYY" date: ${date}`);
  }
  return Number(year) * MONTHS.length + monthIndex;
};
