import type { IResumeEntry } from "@app/types/resume";

/** e.g. "April 2021 – September 2021", or "September 2021 – Present" */
export const toDateRange = ({
  startDate,
  endDate,
}: Pick<IResumeEntry, "startDate" | "endDate">): string =>
  `${startDate} – ${endDate ?? "Present"}`;
