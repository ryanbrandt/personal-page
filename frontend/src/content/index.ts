import education from "@app/content/data/education.json" with { type: "json" };
import experience from "@app/content/data/experience.json" with { type: "json" };
import projects from "@app/content/data/projects.json" with { type: "json" };
import skills from "@app/content/data/skills.json" with { type: "json" };
import type { IContent, IResumeEntry } from "@app/content/types";

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

/**
 * A résumé entry's React key: its start and title, which the content check
 * keeps unique (content/schemas.ts).
 */
export const toEntryKey = ({ start, title }: IResumeEntry): string =>
  `${start} ${title}`;
