import type {
  IProfile,
  IResumeEntry,
  IResumeSkillGroup,
  IWorkEntry,
} from "@app/content/schemas";

/**
 * Where the site's content comes from: today the data files in
 * content/data (StaticContentSource), later an API serving the same
 * shapes (content/schemas.ts).
 */
export interface ContentSource {
  getProfile: () => IProfile;
  /** The jobs, newest first */
  getExperience: () => ReadonlyArray<IResumeEntry>;
  /** The degrees and certificates, newest first */
  getEducation: () => ReadonlyArray<IResumeEntry>;
  /** The skills by category */
  getSkills: () => ReadonlyArray<IResumeSkillGroup>;
  getProjects: () => ReadonlyArray<IWorkEntry>;
}
