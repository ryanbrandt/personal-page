import { CONTENT, toNewestProjectsFirst, toProjectTags } from "@app/content";
import {
  selectWorkEntries,
  selectWorkEntryBySlug,
} from "@app/content/workSlice";
import { useAppSelector } from "@app/store/hooks";

/**
 * The one way components read content. It's build-time data, so these
 * return it directly. Content from an API would come with loading and error
 * states (e.g. RTK Query's `{ data, isLoading, error }`), and their call
 * sites would change to handle them; these hooks are where those call
 * sites all go through.
 *
 * The projects are in the store (the Work slice), the one place RTK Query
 * would go first; the rest is read from the data module.
 */

export const useExperience = () => CONTENT.experience;

export const useEducation = () => CONTENT.education;

export const useSkills = () => CONTENT.skills;

export const useProjects = () => useAppSelector(selectWorkEntries);

/** The project with this slug, if any (none without a slug). */
export const useProject = (slug: string | undefined) =>
  useAppSelector((state) =>
    slug ? selectWorkEntryBySlug(state, slug) : undefined
  );

const PROJECT_TAGS = toProjectTags(CONTENT.projects);
const NEWEST_PROJECTS_FIRST = toNewestProjectsFirst(CONTENT.projects);

/** Every project tag, once each, in alphabetical order. */
export const useProjectTags = () => PROJECT_TAGS;

/** The `count` most recently started projects, newest first. */
export const useRecentProjects = (count: number) =>
  NEWEST_PROJECTS_FIRST.slice(0, count);
