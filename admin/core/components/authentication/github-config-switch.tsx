import { FC } from "react";
import Link from "next/link";
// heroui
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
// store hooks
import { useInstance } from "@/hooks/store";
// types
import { TInstanceAuthenticationMethodKeys } from "@syncturtle/types";

interface IGithubConfigurationProps {
  disabled: boolean;
  updateConfig: (key: TInstanceAuthenticationMethodKeys, value: string) => void;
}

export const GithubConfiguration: FC<IGithubConfigurationProps> = (props) => {
  const { disabled, updateConfig } = props;
  // store hook
  const { formattedConfig } = useInstance();
  const enableGithubConfig = formattedConfig?.IS_GITHUB_ENABLED ?? "";
  const isGithubConfigured = !!formattedConfig?.GITHUB_CLIENT_ID && !!formattedConfig?.GITHUB_CLIENT_SECRET;

  return (
    <>
      {isGithubConfigured ? (
        <div className="flex items-center gap-4">
          <Button as={Link} href="/authentication/google">
            Edit
          </Button>
          <Switch
            isSelected={Boolean(parseInt(enableGithubConfig))}
            aria-label="Enable Github switch"
            size="sm"
            onValueChange={() => {
              if (Boolean(parseInt(enableGithubConfig))) {
                updateConfig("IS_GITHUB_ENABLED", "0");
              } else {
                updateConfig("IS_GITHUB_ENABLED", "1");
              }
            }}
            isDisabled={disabled}
          />
        </div>
      ) : (
        <Button as={Link} href="/authentication/github" radius="sm" size="sm">
          Configure
        </Button>
      )}
    </>
  );
};
