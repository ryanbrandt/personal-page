import type { IsoMonth } from "@app/content/types";

// UTC: `new Date("2021-09")` is midnight UTC on September 1, which is still
// August in US time zones, so formatting it in local time would show the
// previous month.
const MONTH_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * An ISO month ("2021-09") for display: "September 2021". A month that
 * doesn't parse (which the content check should have stopped) shows as it
 * is rather than throwing during render.
 */
export const formatMonth = (isoMonth: IsoMonth): string => {
  const date = new Date(isoMonth);
  return Number.isNaN(date.getTime()) ? isoMonth : MONTH_FORMAT.format(date);
};

/**
 * ISO months as a range for display, e.g. "April 2021 – September 2021",
 * or "September 2021 – Present" while it's ongoing (`end` is null).
 */
export const formatDateRange = (
  start: IsoMonth,
  end: IsoMonth | null
): string => `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
