import { useInstance } from "@/hooks/store";
import { Button, Switch } from "@heroui/react";
import { TInstanceAuthenticationMethodKeys } from "@syncturtle/types";
import Link from "next/link";
import { FC } from "react";

interface IGoogleLoginConfigurationProps {
  disabled: boolean;
  updateConfig: (key: TInstanceAuthenticationMethodKeys, value: string) => void;
}

export const GoogleLoginConfiguration: FC<IGoogleLoginConfigurationProps> = (props) => {
  const { disabled, updateConfig } = props;
  // store hook
  const { formattedConfig } = useInstance();
  const enableGoogleConfig = formattedConfig?.IS_GOOGLE_ENABLED ?? "";
  const isGoogleConfigured = !!formattedConfig?.GOOGLE_CLIENT_ID && !!formattedConfig?.GOOGLE_CLIENT_SECRET;

  return (
    <>
      {isGoogleConfigured ? (
        <div className="flex items-center gap-4">
          <Button as={Link} href="/authentication/google">
            Edit
          </Button>
          <Switch
            isSelected={Boolean(parseInt(enableGoogleConfig))}
            aria-label="Enable Google switch"
            size="sm"
            onValueChange={() => {
              if (Boolean(parseInt(enableGoogleConfig))) {
                updateConfig("IS_GOOGLE_ENABLED", "0");
              } else {
                updateConfig("IS_GOOGLE_ENABLED", "1");
              }
            }}
            isDisabled={disabled}
          />
        </div>
      ) : (
        <Button as={Link} href="/authentication/google" radius="sm" size="sm">
          Configure
        </Button>
      )}
    </>
  );
};
