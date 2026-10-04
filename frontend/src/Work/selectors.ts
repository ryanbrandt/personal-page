import type { RootState } from "@app/store";

export const selectWorkEntries = (state: RootState) => state.work.entries;

export const selectWorkEntryBySlug = (state: RootState, slug: string) =>
  state.work.entries.find((entry) => entry.slug === slug);
