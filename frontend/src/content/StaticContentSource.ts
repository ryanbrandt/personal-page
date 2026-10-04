import type { ContentSource } from "@app/content/ContentSource";
import education from "@app/content/data/education.json";
import experience from "@app/content/data/experience.json";
import profile from "@app/content/data/profile.json";
import projects from "@app/content/data/projects.json";
import skills from "@app/content/data/skills.json";
import {
  profileSchema,
  resumeEntriesSchema,
  skillGroupsSchema,
  workEntriesSchema,
} from "@app/content/schemas";

/** The content as stored, before it's checked against the schemas. */
export interface IStaticContent {
  profile: unknown;
  experience: unknown;
  education: unknown;
  skills: unknown;
  projects: unknown;
}

const DATA: IStaticContent = {
  profile,
  experience,
  education,
  skills,
  projects,
};

/**
 * The content from data files, checked against the schemas once, up front:
 * data that doesn't fit throws (and fails the unit tests) rather than
 * rendering wrong. Each getter returns the same object every time.
 */
export const createStaticContentSource = (
  data: IStaticContent
): ContentSource => {
  const content = {
    profile: profileSchema.parse(data.profile),
    experience: resumeEntriesSchema.parse(data.experience),
    education: resumeEntriesSchema.parse(data.education),
    skills: skillGroupsSchema.parse(data.skills),
    projects: workEntriesSchema.parse(data.projects),
  };

  return {
    getProfile: () => content.profile,
    getExperience: () => content.experience,
    getEducation: () => content.education,
    getSkills: () => content.skills,
    getProjects: () => content.projects,
  };
};

/** The site's content: the data files in content/data. */
export const staticContentSource = createStaticContentSource(DATA);
