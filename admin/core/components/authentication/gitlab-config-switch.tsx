import { useInstance } from "@/hooks/store";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/react";
import { TInstanceAuthenticationMethodKeys } from "@syncturtle/types";
import Link from "next/link";
import { FC } from "react";

interface IGitlabConfigurationProps {
  disabled: boolean;
  updateConfig: (key: TInstanceAuthenticationMethodKeys, value: string) => void;
}

export const GitlabConfiguration: FC<IGitlabConfigurationProps> = (props) => {
  const { disabled, updateConfig } = props;
  // store hook
  const { formattedConfig } = useInstance();

  const enableGitlabConfig = formattedConfig?.IS_GITLAB_ENABLED ?? "";
  const isGitlabConfigured = !!formattedConfig?.GITLAB_CLIENT_ID && !!formattedConfig?.GITLAB_CLIENT_SECRET;

  return (
    <>
      {isGitlabConfigured ? (
        <div className="flex items-center gap-4">
          <Button as={Link} href="/authentication/gitlab">
            Edit
          </Button>
          <Switch
            isSelected={Boolean(parseInt(enableGitlabConfig))}
            aria-label="Enable Gitlab switch"
            size="sm"
            onValueChange={() => {
              if (Boolean(parseInt(enableGitlabConfig))) {
                updateConfig("IS_GITLAB_ENABLED", "0");
              } else {
                updateConfig("IS_GITLAB_ENABLED", "1");
              }
            }}
            isDisabled={disabled}
          />
        </div>
      ) : (
        <Button as={Link} href="/authentication/gitlab" size="sm" radius="sm">
          Configure
        </Button>
      )}
    </>
  );
};
