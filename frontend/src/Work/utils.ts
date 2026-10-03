import type { IWorkEntry } from "@app/types/work";
import type { IWorkFilters } from "@app/Work/types";

/**
 * The projects that match the filters: the search text appears in the
 * title, description or a tag (ignoring case), and, if any tags are chosen,
 * the project has at least one of them.
 */
export const filterWorkEntries = (
  entries: ReadonlyArray<IWorkEntry>,
  { query, tags }: IWorkFilters
): ReadonlyArray<IWorkEntry> => {
  const needle = query.trim().toLowerCase();

  return entries.filter(
    (entry) =>
      (tags.length === 0 || entry.tags.some((tag) => tags.includes(tag))) &&
      [entry.title, entry.description, ...entry.tags].some((text) =>
        text.toLowerCase().includes(needle)
      )
  );
};

/** Up to three initials from a title, e.g. "React Drag Selection" → "RDS". */
export const toInitials = (title: string): string =>
  title
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 3);

/** "August 2021", or "August 2021 – May 2022" once it has ended. */
export const formatWorkDates = ({ start, end }: IWorkEntry): string =>
  end ? `${start} – ${end}` : start;
