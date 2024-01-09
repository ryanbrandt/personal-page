import { RootState } from "@app/store";

export const selectWorkEntries = (state: RootState) => state.work.entries;

export const selectWorkQuery = (state: RootState) => state.work.query;
