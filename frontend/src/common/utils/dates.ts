import type { IsoMonth } from "@app/content/types";

// UTC: `new Date("2021-09")` is midnight UTC on September 1, which is still
// August in US time zones, so formatting it in local time would show the
// previous month.
const MONTH_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** An ISO month ("2021-09") for display: "September 2021". */
export const formatMonth = (isoMonth: IsoMonth): string =>
  MONTH_FORMAT.format(new Date(isoMonth));

/**
 * ISO months as a range for display, e.g. "April 2021 – September 2021",
 * or "September 2021 – Present" while it's ongoing (`end` is null).
 */
export const formatDateRange = (
  start: IsoMonth,
  end: IsoMonth | null
): string => `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
