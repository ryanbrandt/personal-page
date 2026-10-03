import type { IIdentityResource } from "@app/types/common";

/** An image with its intrinsic size, so the page reserves its space. */
export interface IWorkImage {
  src: string;
  width: number;
  height: number;
}

export interface IWorkEntry extends IIdentityResource {
  /** The URL segment of its detail view (`/work/:slug`), from the title */
  slug: string;
  title: string;
  /** A one-sentence summary */
  description: string;
  tags: ReadonlyArray<string>;
  /** A screenshot, or null for the designed fallback */
  image: IWorkImage | null;
  start: string;
  end: string | null;
  githubUrl: string;
}
