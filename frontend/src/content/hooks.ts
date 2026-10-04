import { CONTENT } from "@app/content";
import {
  selectNewestWorkEntriesFirst,
  selectWorkEntries,
  selectWorkEntryBySlug,
  selectWorkTags,
} from "@app/content/workSlice";
import { useAppSelector } from "@app/store/hooks";

/**
 * The one way components read content. It's build-time data, so these
 * return it directly. Content from an API would come with loading and error
 * states (e.g. RTK Query's `{ data, isLoading, error }`), and their call
 * sites would change to handle them; these hooks are where those call
 * sites all go through.
 *
 * Every project read goes through the store (the Work slice and its
 * selectors), where RTK Query would go first; the résumé is read from the
 * data module.
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

/** Every project tag, once each, in alphabetical order. */
export const useProjectTags = () => useAppSelector(selectWorkTags);

/** The `count` most recently started projects, newest first. */
export const useRecentProjects = (count: number) =>
  useAppSelector(selectNewestWorkEntriesFirst).slice(0, count);
