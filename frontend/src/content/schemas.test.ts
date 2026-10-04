import { describe, expect, it } from "vitest";

import education from "@app/content/data/education.json";
import experience from "@app/content/data/experience.json";
import profile from "@app/content/data/profile.json";
import projects from "@app/content/data/projects.json";
import skills from "@app/content/data/skills.json";
import {
  profileSchema,
  resumeEntriesSchema,
  resumeEntrySchema,
  skillGroupsSchema,
  workEntriesSchema,
  workEntrySchema,
} from "@app/content/schemas";

const JOB = experience[0];
const PROJECT = projects[0];

describe("the content data", () => {
  it.each([
    ["profile", profileSchema, profile],
    ["experience", resumeEntriesSchema, experience],
    ["education", resumeEntriesSchema, education],
    ["skills", skillGroupsSchema, skills],
    ["projects", workEntriesSchema, projects],
  ] as const)("%s fits its schema", (_, schema, data) => {
    expect(schema.safeParse(data).error).toBeUndefined();
  });

  it("has project slugs that are unique and not empty", () => {
    const slugs = projects.map(({ slug }) => slug);
    expect(slugs.every((slug) => slug.length > 0)).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("resumeEntrySchema", () => {
  it.each(["September 2021", "2021-9", "2021-13", "2021-09-01", ""])(
    "rejects the date %j",
    (start) => {
      expect(resumeEntrySchema.safeParse({ ...JOB, start }).success).toBe(
        false
      );
    }
  );

  it("takes a null end (ongoing) but not a missing one", () => {
    expect(resumeEntrySchema.safeParse({ ...JOB, end: null }).success).toBe(
      true
    );
    expect(
      resumeEntrySchema.safeParse({ ...JOB, end: undefined }).success
    ).toBe(false);
  });

  it("drops fields outside the schema", () => {
    const parsed = resumeEntrySchema.parse({ ...JOB, created: "01/01/1970" });
    expect(parsed).not.toHaveProperty("created");
  });
});

describe("workEntrySchema", () => {
  it.each(["", "Has Capitals", "trailing-", "-leading", "two--hyphens"])(
    "rejects the slug %j",
    (slug) => {
      expect(workEntrySchema.safeParse({ ...PROJECT, slug }).success).toBe(
        false
      );
    }
  );

  it("takes a null image (the designed fallback)", () => {
    expect(workEntrySchema.safeParse({ ...PROJECT, image: null }).success).toBe(
      true
    );
  });

  it("rejects an image without its size", () => {
    const image = { src: "https://example.com/a.png" };
    expect(workEntrySchema.safeParse({ ...PROJECT, image }).success).toBe(
      false
    );
  });
});

describe("workEntriesSchema", () => {
  it("rejects a repeated slug", () => {
    const result = workEntriesSchema.safeParse([PROJECT, { ...PROJECT }]);
    expect(result.error?.issues[0]?.message).toBe(
      "Project slugs must be unique"
    );
  });
});
