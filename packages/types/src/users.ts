type TLoginMediums = "email" | "magic-code" | "github" | "gitlab" | "google";

export type TOnboardingSteps = {
  profileComplete: boolean;
  workspaceCreate: boolean;
  workspaceInvite: boolean;
  workspaceJoin: boolean;
};

export interface IUserLite {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  displayName: string;
  dateJoined: string;
}
export interface IUser extends IUserLite {
  dateJoined: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPasswordAutoset: boolean;
  mobileNumber: string | null;
  lastWorkspaceId: string;
  username: string;
  lastLoginMedium: TLoginMediums;
}

export type TUserProfile = {
  id: string | undefined;
  user: string | undefined;
  role: string | undefined;
  lastWorkspaceId: string | undefined;
  onboardingStep: TOnboardingSteps;
  isOnboarded: boolean;
  billingAddressCountry: string | undefined;
  billingAddress: string | undefined;
  hasBillingAddress: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export interface IUserSettings {
  id: string | undefined;
  email: string | undefined;
  workspace: {
    lastWorkspaceId: string | undefined;
    lastWorkspaceSlug: string | undefined;
    lastWorkspaceName: string | undefined;
    lastWorkspaceLogo: string | undefined;
    fallbackWorkspaceId: string | undefined;
    fallbackWorkspaceSlug: string | undefined;
    invites: number | undefined;
  };
}
