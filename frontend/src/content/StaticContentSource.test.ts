import { describe, expect, it } from "vitest";

import education from "@app/content/data/education.json" with { type: "json" };
import experience from "@app/content/data/experience.json" with { type: "json" };
import profile from "@app/content/data/profile.json" with { type: "json" };
import projects from "@app/content/data/projects.json" with { type: "json" };
import skills from "@app/content/data/skills.json" with { type: "json" };
import {
  createStaticContentSource,
  type IStaticContent,
  staticContentSource,
} from "@app/content/StaticContentSource";

const DATA: IStaticContent = {
  profile,
  experience,
  education,
  skills,
  projects,
};

describe("staticContentSource", () => {
  it("serves the data files", () => {
    expect(staticContentSource.getProfile()).toEqual(profile);
    expect(staticContentSource.getExperience()).toEqual(experience);
    expect(staticContentSource.getEducation()).toEqual(education);
    expect(staticContentSource.getSkills()).toEqual(skills);
    expect(staticContentSource.getProjects()).toEqual(projects);
  });

  it("returns the same objects every time", () => {
    expect(staticContentSource.getProjects()).toBe(
      staticContentSource.getProjects()
    );
    expect(staticContentSource.getExperience()).toBe(
      staticContentSource.getExperience()
    );
  });
});

describe("createStaticContentSource", () => {
  it("throws on data that doesn't fit the schemas", () => {
    const [job, ...jobs] = experience;
    const data = {
      ...DATA,
      experience: [{ ...job, start: "September 2021" }, ...jobs],
    };
    expect(() => createStaticContentSource(data)).toThrow(/ISO month/);
  });

  it("throws on repeated project slugs", () => {
    const data = { ...DATA, projects: [...projects, projects[0]] };
    expect(() => createStaticContentSource(data)).toThrow(/slugs/);
  });
});
