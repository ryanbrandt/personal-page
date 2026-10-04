import { contentSource } from "@app/content/source";
import { useAppSelector } from "@app/store/hooks";
import { selectWorkEntries } from "@app/Work/selectors";

/**
 * How components read the content. They return it as it is today, from
 * memory; with an API behind it, these become RTK Query hooks with the same
 * names and data.
 */

export const useProfile = () => contentSource.getProfile();

export const useExperience = () => contentSource.getExperience();

export const useEducation = () => contentSource.getEducation();

export const useSkills = () => contentSource.getSkills();

/** The projects, from the store (the Work slice loads them). */
export const useProjects = () => useAppSelector(selectWorkEntries);
