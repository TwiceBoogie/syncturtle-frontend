import { useInstance } from "@/hooks/store";
import { Switch } from "@heroui/react";
import { MessagesSquare } from "lucide-react";
import { FC, useState } from "react";
import useSWR from "swr";

interface IIntercomConfigProps {
  isTelemetryEnabled: boolean;
}

export const IntercomConfig: FC<IIntercomConfigProps> = (props) => {
  const { isTelemetryEnabled } = props;
  // store hooks
  const { instanceConfigurations, updateInstanceConfigurations, fetchInstanceConfigurations } = useInstance();
  // states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // derived
  const isIntercomEnabled = isTelemetryEnabled
    ? instanceConfigurations
      ? instanceConfigurations?.find((config) => config.key === "IS_INTERCOM_ENABLED")?.value === "1"
        ? true
        : false
      : undefined
    : false;

  const { isLoading } = useSWR(isTelemetryEnabled ? "INSTANCE_CONFIGURATIONS" : null, () =>
    isTelemetryEnabled ? fetchInstanceConfigurations() : null
  );

  const initialLoader = isLoading && isIntercomEnabled === undefined;

  return (
    <div className="flex items-center gap-14 px-4 py-3 border border-custom-border-200 rounded">
      <div className="grow flex items-center gap-4">
        <div className="shrink-0">
          <div className="flex items-center justify-center w-10 h-10 bg-custom-background-90 rounded-full">
            <MessagesSquare className="w-6 h-6 text-custom-text-300/80 p-0.5" />
          </div>
        </div>

        <div className="grow">
          <div className="text-sm font-medium text-custom-text-100 leading-5">Chat with us</div>
          <div className="text-xs font-normal text-custom-text-300 leading-5">
            Let your users chat with us via Intercom or another service. Toggling Telemetry off turns this off
            automatically.
          </div>
        </div>

        <div className="ml-auto">
          <Switch
            isSelected={isIntercomEnabled ? true : false}
            size="sm"
            isDisabled={!isIntercomEnabled || isSubmitting || initialLoader}
          />
        </div>
      </div>
    </div>
  );
};
