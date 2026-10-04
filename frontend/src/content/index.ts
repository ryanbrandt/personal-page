import education from "@app/content/data/education.json" with { type: "json" };
import experience from "@app/content/data/experience.json" with { type: "json" };
import projects from "@app/content/data/projects.json" with { type: "json" };
import skills from "@app/content/data/skills.json" with { type: "json" };
import type { IContent, IResumeEntry, IWorkEntry } from "@app/content/types";

/**
 * The site's content, from content/data. `vite build` checks it against
 * content/schemas.ts (see vite.config.ts), which is what makes it safe to
 * type it as IContent here.
 */
export const CONTENT = {
  experience,
  education,
  skills,
  projects,
} as IContent;

/** Every project tag, once each, in alphabetical order. */
export const toProjectTags = (
  entries: ReadonlyArray<IWorkEntry>
): ReadonlyArray<string> =>
  [...new Set(entries.flatMap(({ tags }) => tags))].sort((a, b) =>
    a.localeCompare(b)
  );

/** The projects, the most recently started first. */
export const toNewestProjectsFirst = (
  entries: ReadonlyArray<IWorkEntry>
): ReadonlyArray<IWorkEntry> =>
  // ISO months ("2021-09") sort as text.
  entries.toSorted((a, b) => b.start.localeCompare(a.start));

/** A résumé entry's React key: its start and title, unique together. */
export const toEntryKey = ({ start, title }: IResumeEntry): string =>
  `${start} ${title}`;
