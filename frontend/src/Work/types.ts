import type { IWorkEntry } from "@app/types/work";

export interface IWorkSlice {
  entries: Array<IWorkEntry>;
  query: string;
}
