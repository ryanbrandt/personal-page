import { IIdentityResource } from "@app/types/common";

export interface IWorkEntry extends IIdentityResource {
  title: string;
  description: string;
  primaryMediaLink: string | null;
  secondaryMediaLink: string | null;
  start: string;
  end: string | null;
}
