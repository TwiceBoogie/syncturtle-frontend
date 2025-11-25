import { TPaginationInfo } from "./common";
import { IUser } from "./users";

export enum EUserWorkspaceRoles {
  ADMIN = 20,
  MEMBER = 15,
  GUEST = 5,
}

export interface IWorkspace {
  readonly id: string;
  readonly owner: IUser;
  name: string;
  url: string;
  logoUrl: string | null;
  readonly totalMembers: number;
  readonly slug: string;
  readonly createdBy: string;
  readonly updatedBy: string;
  organizationSize: string;
  role: number;
}

export interface IWorkspaceLite {
  readonly id: string;
  name: string;
  slug: string;
}

export type TWorkspacePaginationInfo = TPaginationInfo & {
  results: IWorkspace[];
};
