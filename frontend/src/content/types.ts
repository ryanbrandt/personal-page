import type { z } from "zod";

import type { contentSchema } from "@app/content/schemas";

/** A month as ISO "YYYY-MM", e.g. "2021-09". */
export type IsoMonth = `${number}-${number}`;

/** The content, as content/schemas.ts describes it. */
export type IContent = z.infer<typeof contentSchema>;

export type IResumeEntry = IContent["experience"][number];
export type IResumeSkillGroup = IContent["skills"][number];
export type IWorkEntry = IContent["projects"][number];
