import type { IWorkEntry } from "@app/content/schemas";

export interface IWorkSlice {
  entries: ReadonlyArray<IWorkEntry>;
}

/** The project filters, kept in the URL query (`?q=&tag=`). */
export interface IWorkFilters {
  query: string;
  tags: ReadonlyArray<string>;
}
