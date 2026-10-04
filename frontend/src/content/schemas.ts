import { z } from "zod";

import type { IsoMonth } from "@app/content/types";

/**
 * The content's shape: the contract for content/data and for an API that
 * may one day serve it. `vite build` checks the data against it (see
 * vite.config.ts), so it runs at build time only and isn't in the app's
 * bundle: the app takes its types (content/types.ts).
 */

const ISO_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

/** A month as ISO "YYYY-MM", e.g. "2021-09"; formatted for display. */
const isoMonthSchema = z.custom<IsoMonth>(
  (value) => typeof value === "string" && ISO_MONTH.test(value),
  'Expected an ISO month ("YYYY-MM")'
);

/** When something started, and ended (null while it's ongoing). */
const periodShape = {
  start: isoMonthSchema,
  end: isoMonthSchema.nullable(),
};

const textSchema = z.string().min(1);

const isUnique = <T>(entries: ReadonlyArray<T>, toKey: (entry: T) => string) =>
  new Set(entries.map(toKey)).size === entries.length;

const textListSchema = z.array(textSchema).readonly();

/** A job, degree or certificate on the résumé. */
const resumeEntrySchema = z.object({
  /** The role, degree or certificate */
  title: textSchema,
  /** The company or school */
  organization: textSchema,
  description: textSchema,
  /** Shown as a bulleted list; empty for none */
  highlights: textListSchema,
  ...periodShape,
});

// Ongoing entries first, then by end month, latest first.
const toEndKey = ({ end }: { end: IsoMonth | null }) => end ?? "9999-12";

/**
 * Résumé entries, newest (latest end) first, as they're shown, each with a
 * unique start and title (its React key: toEntryKey in content/index.ts).
 */
const resumeEntriesSchema = z
  .array(resumeEntrySchema)
  .readonly()
  .refine(
    (entries) => isUnique(entries, ({ start, title }) => `${start} ${title}`),
    "Entries must differ in start or title"
  )
  .refine(
    (entries) =>
      entries.every(
        (entry, index) =>
          index === 0 ||
          toEndKey(entries[index - 1]).localeCompare(toEndKey(entry)) >= 0
      ),
    "Entries must be newest first (by end month, ongoing first)"
  );

const skillGroupSchema = z.object({
  name: textSchema,
  skills: textListSchema,
});

/**
 * An image with its intrinsic size, so the page reserves its space.
 * TODO(images): processed variants: resized WebP/AVIF in a `srcset` (a
 * `<picture>` in ProjectImage), served from cacheable URLs with a long
 * Cache-Control; today's S3 PNGs are full size, with no Cache-Control. The
 * content check plugin in vite.config.ts is where they'd be made and
 * measured.
 */
const workImageSchema = z.object({
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

const workEntrySchema = z.object({
  slug: slugSchema,
  title: textSchema,
  /** A one-sentence summary */
  description: textSchema,
  tags: textListSchema,
  /** A screenshot, or null for the designed fallback */
  image: workImageSchema.nullable(),
  githubUrl: z.url(),
  ...periodShape,
});

/** The projects, in the order shown, with unique slugs (each is a URL). */
const workEntriesSchema = z
  .array(workEntrySchema)
  .readonly()
  .refine(
    (entries) => isUnique(entries, ({ slug }) => slug),
    "Project slugs must be unique"
  );

/** All of the content (content/data). */
export const contentSchema = z.object({
  experience: resumeEntriesSchema,
  education: resumeEntriesSchema,
  skills: z.array(skillGroupSchema).readonly(),
  projects: workEntriesSchema,
});
