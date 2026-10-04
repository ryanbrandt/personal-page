import { z } from "zod";

/**
 * The content's shape, checked when it loads: the contract a content API
 * would serve (see ContentSource).
 */

/** A month as ISO "YYYY-MM", e.g. "2021-09"; formatted for display. */
const isoMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected an ISO month ("YYYY-MM")');

const textListSchema = z.array(z.string().min(1)).readonly();

export const profileSchema = z.object({
  name: z.string().min(1),
  /** One or two sentences under the home page's heading */
  bio: z.string().min(1),
});

/** A job, degree or certificate on the résumé. */
export const resumeEntrySchema = z.object({
  /** The role, degree or certificate */
  title: z.string().min(1),
  /** The company or school */
  organization: z.string().min(1),
  description: z.string().min(1),
  /** Shown as a bulleted list; empty for none */
  highlights: textListSchema,
  start: isoMonthSchema,
  /** null while it's ongoing */
  end: isoMonthSchema.nullable(),
});

export const resumeEntriesSchema = z.array(resumeEntrySchema).readonly();

export const skillGroupSchema = z.object({
  name: z.string().min(1),
  skills: textListSchema,
});

export const skillGroupsSchema = z.array(skillGroupSchema).readonly();

/** An image with its intrinsic size, so the page reserves its space. */
export const workImageSchema = z.object({
  src: z.url(),
  width: z.int().positive(),
  height: z.int().positive(),
});

/**
 * A project's URL segment (`/work/:slug`): lower case letters and digits,
 * with a hyphen between words. Stored rather than made from the title, so a
 * renamed project keeps its URL.
 */
const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Expected a slug like project-name");

export const workEntrySchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  /** A one-sentence summary */
  description: z.string().min(1),
  tags: textListSchema,
  /** A screenshot, or null for the designed fallback */
  image: workImageSchema.nullable(),
  start: isoMonthSchema,
  /** null while it's ongoing */
  end: isoMonthSchema.nullable(),
  githubUrl: z.url(),
});

/** The projects, whose slugs are unique (each is a URL). */
export const workEntriesSchema = z
  .array(workEntrySchema)
  .readonly()
  .refine(
    (entries) =>
      new Set(entries.map(({ slug }) => slug)).size === entries.length,
    "Project slugs must be unique"
  );

export type IProfile = z.infer<typeof profileSchema>;
export type IResumeEntry = z.infer<typeof resumeEntrySchema>;
export type IResumeSkillGroup = z.infer<typeof skillGroupSchema>;
export type IWorkImage = z.infer<typeof workImageSchema>;
export type IWorkEntry = z.infer<typeof workEntrySchema>;
