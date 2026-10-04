import { z } from "zod/mini";

/**
 * The content's shape, checked when it loads: the contract a content API
 * would serve (see ContentSource). Zod Mini: the same schemas as Zod, a
 * quarter of its bundle size.
 */

/** A month as ISO "YYYY-MM", e.g. "2021-09"; formatted for display. */
const isoMonthSchema = z
  .string()
  .check(
    z.regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected an ISO month ("YYYY-MM")')
  );

const nonEmptyTextSchema = z.string().check(z.minLength(1));

const textListSchema = z.readonly(z.array(nonEmptyTextSchema));

export const profileSchema = z.object({
  name: nonEmptyTextSchema,
  /** One or two sentences under the home page's heading */
  bio: nonEmptyTextSchema,
});

/** A job, degree or certificate on the résumé. */
export const resumeEntrySchema = z.object({
  /** The role, degree or certificate */
  title: nonEmptyTextSchema,
  /** The company or school */
  organization: nonEmptyTextSchema,
  description: nonEmptyTextSchema,
  /** Shown as a bulleted list; empty for none */
  highlights: textListSchema,
  start: isoMonthSchema,
  /** null while it's ongoing */
  end: z.nullable(isoMonthSchema),
});

export const resumeEntriesSchema = z.readonly(z.array(resumeEntrySchema));

export const skillGroupSchema = z.object({
  name: nonEmptyTextSchema,
  skills: textListSchema,
});

export const skillGroupsSchema = z.readonly(z.array(skillGroupSchema));

/**
 * An image with its intrinsic size, so the page reserves its space.
 * TODO(images): processed variants: resized WebP/AVIF in a `srcset` (a
 * `<picture>` in ProjectImage), their sizes measured at build time, served
 * from cacheable URLs with a long Cache-Control. Today's S3 PNGs are full
 * size, with no Cache-Control.
 */
export const workImageSchema = z.object({
  src: z.url(),
  width: z.int().check(z.positive()),
  height: z.int().check(z.positive()),
});

/**
 * A project's URL segment (`/work/:slug`): lower case letters and digits,
 * with a hyphen between words. Stored rather than made from the title, so a
 * renamed project keeps its URL.
 */
const slugSchema = z
  .string()
  .check(
    z.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Expected a slug like project-name")
  );

export const workEntrySchema = z.object({
  slug: slugSchema,
  title: nonEmptyTextSchema,
  /** A one-sentence summary */
  description: nonEmptyTextSchema,
  tags: textListSchema,
  /** A screenshot, or null for the designed fallback */
  image: z.nullable(workImageSchema),
  start: isoMonthSchema,
  /** null while it's ongoing */
  end: z.nullable(isoMonthSchema),
  githubUrl: z.url(),
});

/** The projects, whose slugs are unique (each is a URL). */
export const workEntriesSchema = z
  .readonly(z.array(workEntrySchema))
  .check(
    z.refine(
      (entries) =>
        new Set(entries.map(({ slug }) => slug)).size === entries.length,
      "Project slugs must be unique"
    )
  );

export type IProfile = z.infer<typeof profileSchema>;
export type IResumeEntry = z.infer<typeof resumeEntrySchema>;
export type IResumeSkillGroup = z.infer<typeof skillGroupSchema>;
export type IWorkImage = z.infer<typeof workImageSchema>;
export type IWorkEntry = z.infer<typeof workEntrySchema>;
