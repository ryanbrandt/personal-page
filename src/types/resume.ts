import {
  ICreatedModifiedResource,
  IIdentityResource,
  INamedResource,
} from "@app/types/common";

export type ResumeEntryType = "Work" | "Education" | "Other";

export interface IResumeEntry
  extends IIdentityResource,
    INamedResource,
    ICreatedModifiedResource {
  description: string;
  accomplishments: string | null;
  startDate: string;
  endDate: string | null;
  type: ResumeEntryType;
}

export interface IResumeSkill extends IIdentityResource, INamedResource {}
