import { IUserLite } from "../users";
import { TInstanceAuthenticationKeys } from "./auth";
import { TInstanceEmailConfigurationKeys } from "./email";
import { TInstanceWorkspaceConfigurationKeys } from "./workspace";

export interface IInstanceInfo {
  instance: IInstance;
  config: IInstanceConfig;
}

export interface IInstance {
  id: string;
  createdAt: string;
  updatedAt: string;
  instanceName: string | undefined;
  instanceId: string | undefined;
  currentVersion: string | undefined;
  latestVersion: string | undefined;
  lastCheckedAt: string | undefined;
  namespace: string | undefined;
  isTelemetryEnabled: boolean;
  isSupportRequired: boolean;
  isActivated: boolean;
  isSetupDone: boolean;
  isVerified: boolean;
  createdBy: string | undefined;
  updatedBy: string | undefined;
  workspacesExist: boolean;
}

export type TInstanceUpdate = Partial<Pick<IInstance, "instanceName" | "namespace">>;

export interface IInstanceConfig {
  enableSignup: boolean;
  isWorkspaceCreationDisabled: boolean;
  isGoogleEnabled: boolean;
  isGithubEnabled: boolean;
  isGitlabEnabled: boolean;
  isMagicLoginEnabled: boolean;
  isEmailPasswordEnabled: boolean;
  githubAppName: string | undefined;
  posthogApiKey: string | undefined;
  posthogHost: string | undefined;
  isSmtpConfigured: boolean;
  appBaseUrl: string | undefined;
  adminBaseUrl: string | undefined;
  isIntercomEnabled: boolean;
  intercomAppId: string | undefined;
}

export interface IInstanceAdmin {
  id: string;
  instance: string;
  user: IUserLite;
  role: number;
  isVerified: boolean;
  updatedAt: string;
  createdAt: string;
}

export type TInstanceIntercomConfigurationKeys = "IS_INTERCOM_ENABLED" | "INTERCOM_APP_ID";

export type TInstanceConfigurationKeys =
  | TInstanceEmailConfigurationKeys
  | TInstanceAuthenticationKeys
  | TInstanceIntercomConfigurationKeys
  | TInstanceWorkspaceConfigurationKeys;

export interface IInstanceConfiguration {
  id: string;
  key: TInstanceConfigurationKeys;
  value: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type TFormattedInstanceConfiguration = {
  [key in TInstanceConfigurationKeys]: string;
};
