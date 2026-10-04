import { describe, expect, it } from "vitest";

import { CONTENT } from "@app/content";
import { contentSchema } from "@app/content/schemas";

// The same check `vite build` runs (see vite.config.ts).
describe("contentSchema", () => {
  it("accepts the site's content", () => {
    expect(contentSchema.safeParse(CONTENT).error).toBeUndefined();
  });

  it("rejects a repeated project slug", () => {
    const [project] = CONTENT.projects;
    const { error } = contentSchema.safeParse({
      ...CONTENT,
      projects: [...CONTENT.projects, { ...project, title: "Renamed" }],
    });
    expect(error?.issues.map(({ message }) => message)).toEqual([
      "Project slugs must be unique",
    ]);
  });

  it("rejects a repeated résumé entry (start and title)", () => {
    const [job] = CONTENT.experience;
    const { error } = contentSchema.safeParse({
      ...CONTENT,
      experience: [job, { ...job, organization: "Elsewhere" }],
    });
    expect(error?.issues.map(({ message }) => message)).toEqual([
      "Entries must differ in start or title",
    ]);
  });

  it("rejects résumé entries that aren't newest first", () => {
    const { error } = contentSchema.safeParse({
      ...CONTENT,
      experience: CONTENT.experience.toReversed(),
    });
    expect(error?.issues.map(({ message }) => message)).toEqual([
      "Entries must be newest first (by end month, ongoing first)",
    ]);
  });
});
