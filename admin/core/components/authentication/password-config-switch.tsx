import { FC } from "react";
// heroui
import { Switch } from "@heroui/switch";
// store
import { useInstance } from "@/hooks/store";
// types
import { TInstanceAuthenticationMethodKeys } from "@syncturtle/types";

interface IPasswordLoginConfigurationProps {
  disabled: boolean;
  updateConfig: (key: TInstanceAuthenticationMethodKeys, value: string) => void;
}

export const PasswordLoginConfiguration: FC<IPasswordLoginConfigurationProps> = (props) => {
  const { disabled, updateConfig } = props;
  // store hook
  const { formattedConfig } = useInstance();
  const enablePasswordLogin = formattedConfig?.ENABLE_EMAIL_PASSWORD ?? "";

  return (
    <Switch
      isSelected={Boolean(parseInt(enablePasswordLogin))}
      aria-label="Enable password login switch"
      size="sm"
      onValueChange={() => {
        if (Boolean(parseInt(enablePasswordLogin))) {
          updateConfig("ENABLE_EMAIL_PASSWORD", "0");
        } else {
          updateConfig("ENABLE_EMAIL_PASSWORD", "1");
        }
      }}
      disabled={disabled}
    />
  );
};
