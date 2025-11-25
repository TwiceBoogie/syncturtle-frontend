import { FC } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
// lucide
import { KeyRound, Mails } from "lucide-react";
// components
import { PasswordLoginConfiguration } from "@/components/authentication/password-config-switch";
import { GoogleLoginConfiguration } from "@/components/authentication/google-config-switch";
import { GithubConfiguration } from "@/components/authentication/github-config-switch";
import { GitlabConfiguration } from "@/components/authentication/gitlab-config-switch";
import { EmailCodesConfiguration } from "@/components/authentication/email-config-switch";
import { AuthenticationMethodCard } from "@/components/authentication/authentication-method-card";
// assets
import githubLightModeImage from "@/public/logos/github-black.png";
import githubDarkModeImage from "@/public/logos/github-white.png";
import GitlabLogo from "@/public/logos/gitlab-logo.svg";
import GoogleLogo from "@/public/logos/google-logo.svg";
// types
import {
  TGetBaseAuthenticationModeProps,
  TInstanceAuthenticationModes,
  TInstanceConfigurationKeys,
} from "@syncturtle/types";

export interface IAuthenticationModeProps {
  disabled: boolean;
  updateConfig: (key: TInstanceConfigurationKeys, value: string) => void;
}

export const getAuthenticationModes: (props: TGetBaseAuthenticationModeProps) => TInstanceAuthenticationModes[] = ({
  disabled,
  updateConfig,
  resolvedTheme,
}) => [
  {
    key: "unique-codes",
    name: "Unique codes",
    description:
      "Log in or sign up for SyncTurtle using codes sent via email. Must have SMTP setup to use this method.",
    icon: <Mails className="h-6 w-6 p-0.5" />,
    config: <EmailCodesConfiguration disabled={disabled} updateConfig={updateConfig} />,
  },
  {
    key: "passwords-login",
    name: "Passwords",
    description: "Allow members to create accounts with email and passwords",
    icon: <KeyRound className="h-6 w-6 p-0.5" />,
    config: <PasswordLoginConfiguration disabled={disabled} updateConfig={updateConfig} />,
  },
  {
    key: "google",
    name: "Google",
    description: "Allow members to login or sign-up for SyncTurtle with their Google accounts.",
    icon: <Image src={GoogleLogo} height={20} width={20} alt="Google Logo" />,
    config: <GoogleLoginConfiguration disabled={disabled} updateConfig={updateConfig} />,
  },
  {
    key: "github",
    name: "Github",
    description: "Allow members to login or sign-up for Syncturtle with their Github accounts.",
    icon: (
      <Image
        src={resolvedTheme === "dark" ? githubDarkModeImage : githubLightModeImage}
        height={20}
        width={20}
        alt="Github Logo"
      />
    ),
    config: <GithubConfiguration disabled={disabled} updateConfig={updateConfig} />,
  },
  {
    key: "gitlab",
    name: "Gitlab",
    description: "Allow members to login or sign-up for SyncTurtle with their Gitlab accounts.",
    icon: <Image src={GitlabLogo} height={20} width={20} alt="Gitlab Logo" />,
    config: <GitlabConfiguration disabled={disabled} updateConfig={updateConfig} />,
  },
];

export const AuthenticationModes: FC<IAuthenticationModeProps> = (props) => {
  const { disabled, updateConfig } = props;
  const { resolvedTheme } = useTheme();

  return (
    <>
      {getAuthenticationModes({ disabled, updateConfig, resolvedTheme }).map((method) => (
        <AuthenticationMethodCard
          key={method.key}
          name={method.name}
          description={method.description}
          icon={method.icon}
          config={method.config}
          disabled={disabled}
          unavailable={method.unavailable}
        />
      ))}
    </>
  );
};
