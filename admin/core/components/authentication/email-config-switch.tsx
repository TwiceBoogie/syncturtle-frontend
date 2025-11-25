import { useInstance } from "@/hooks/store";
import { Switch } from "@heroui/react";
import { TInstanceAuthenticationMethodKeys } from "@syncturtle/types";
import { FC } from "react";

interface IEmailCodesConfigurationProps {
  disabled: boolean;
  updateConfig: (key: TInstanceAuthenticationMethodKeys, value: string) => void;
}

export const EmailCodesConfiguration: FC<IEmailCodesConfigurationProps> = (props) => {
  const { disabled, updateConfig } = props;
  // store hook
  const { formattedConfig } = useInstance();
  const enableMagicLogin = formattedConfig?.ENABLE_MAGIC_LINK_LOGIN ?? "";

  return (
    <Switch
      isSelected={Boolean(parseInt(enableMagicLogin))}
      aria-label="Enable magic login switch"
      size="sm"
      onValueChange={() => {
        if (Boolean(parseInt(enableMagicLogin))) {
          updateConfig("ENABLE_MAGIC_LINK_LOGIN", "0");
        } else {
          updateConfig("ENABLE_MAGIC_LINK_LOGIN", "1");
        }
      }}
      disabled={disabled}
    />
  );
};
