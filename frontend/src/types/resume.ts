import type {
  ICreatedModifiedResource,
  IIdentityResource,
  INamedResource,
} from "@app/types/common";

export type ResumeEntryType = "Work" | "Education" | "Other";

export interface IResumeEntry
  extends IIdentityResource, ICreatedModifiedResource {
  /** The role, degree or certificate */
  title: string;
  /** The company or school */
  organization: string;
  description: string;
  /** Shown as a bulleted list; empty for none */
  highlights: ReadonlyArray<string>;
  startDate: string;
  endDate: string | null;
  type: ResumeEntryType;
}

export interface IResumeSkillGroup extends INamedResource {
  skills: ReadonlyArray<string>;
}
