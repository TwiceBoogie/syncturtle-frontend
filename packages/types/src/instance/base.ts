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
  // whitelist_emails: string | undefined;
  instanceId: string | undefined;
  // license_key: string | undefined;
  currentVersion: string | undefined;
  latestVersion: string | undefined;
  lastCheckedAt: string | undefined;
  namespace: string | undefined;
  // is_telemetry_enabled: boolean;
  // is_support_required: boolean;
  isActivated: boolean;
  isSetupDone: boolean;
  // is_signup_screen_visited: boolean;
  // user_count: number | undefined;
  isVerified: boolean;
  createdBy: string | undefined;
  updatedBy: string | undefined;
  // workspaces_exist: boolean;
}

export type TInstanceUpdate = Partial<Pick<IInstance, "instanceName" | "namespace">>;

export interface IInstanceConfig {
  enableSignup: boolean;
  // is_workspace_creation_disabled: boolean;
  isGoogleEnabled: boolean;
  isGithubEnabled: boolean;
  isGitlabEnabled: boolean;
  isMagicLoginEnabled: boolean;
  isEmailPasswordEnabled: boolean;
  githubAppName: string | undefined;
  // slack_client_id: string | undefined;
  // posthog_api_key: string | undefined;
  // posthog_host: string | undefined;
  // has_unsplash_configured: boolean;
  // has_llm_configured: boolean;
  // file_size_limit: number | undefined;
  isSmtpConfigured: boolean;
  appBaseUrl: string | undefined;
  // space_base_url: string | undefined;
  adminBaseUrl: string | undefined;
  // intercom
  // is_intercom_enabled: boolean;
  // intercom_app_id: string | undefined;
  // instance_changelog_url?: string;
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

export type TInstanceConfigurationKeys =
  | TInstanceEmailConfigurationKeys
  | TInstanceAuthenticationKeys
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
