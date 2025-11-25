import { FC, FormEvent, useEffect, useMemo, useState } from "react";
// 3rd
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
// store
import { useInstance } from "@/hooks/store";
// service
import { IApiErrorPayload, IInstance, IInstanceAdmin } from "@syncturtle/types";
import { IntercomConfig } from "./intercom";
import { Telescope } from "lucide-react";
import { Switch } from "@heroui/switch";

interface IGeneralForm {
  instance: IInstance;
  instanceAdmins: IInstanceAdmin[];
}

type TGeneralFormValues = Pick<IInstance, "instanceName" | "isTelemetryEnabled">;
type TFieldErrors = Partial<Record<keyof TGeneralFormValues, string | string[]>>;

export const GeneralForm: FC<IGeneralForm> = (props) => {
  const { instance, instanceAdmins } = props;
  // store hooks
  const { instanceConfigurations, updateInstanceInfo, updateInstanceConfigurations } = useInstance();

  // state
  const [formData, setFormData] = useState<TGeneralFormValues>({
    instanceName: instance?.instanceName,
    isTelemetryEnabled: instance?.isTelemetryEnabled,
  });
  const [fieldErrors, setFieldErrors] = useState<TFieldErrors>({});
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // derived
  const isDirty = useMemo(() => {
    return (
      formData.instanceName !== instance.instanceName || formData.isTelemetryEnabled !== instance.isTelemetryEnabled
    );
  }, [formData, instance]);

  const handleFormChange = <K extends keyof TGeneralFormValues>(key: K, value: TGeneralFormValues[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setBannerError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setBannerError(null);

    try {
      setIsSubmitting(true);

      const payload: Partial<IInstance> = {
        ...formData,
      };

      // cehck current intercom state
      const isIntercomEnabled =
        instanceConfigurations?.find((config) => config.key === "IS_INTERCOM_ENABLED")?.value === "1";

      // if turning telemtry off while intercom is on, turn off intercom
      if (payload.isTelemetryEnabled === false && isIntercomEnabled) {
        try {
          await updateInstanceConfigurations({ IS_INTERCOM_ENABLED: "0" });
        } catch (error) {
          // non fatel; just proceed with instance update
          console.error("Failed to disable Intercom config: ", error);
        }
      }

      await updateInstanceInfo(payload);

      addToast({
        title: "Success",
        description: "Settings updated successfully",
        color: "success",
      });
    } catch (error: unknown) {
      const apiError = error as IApiErrorPayload;

      if (apiError && typeof apiError === "object" && "type" in apiError) {
        if (apiError.fieldErrors) {
          setFieldErrors(apiError.fieldErrors as TFieldErrors);
        }

        const message = apiError.message ?? "Oops, an error has occurred while saving your settings. Please try again";
        setBannerError(message);

        addToast({
          title: "Error",
          description: message,
          color: "danger",
        });
      } else if (error instanceof Error) {
        setBannerError(error.message);
        addToast({
          title: "Error",
          description: error.message,
          color: "danger",
        });
      } else {
        const message = apiError.message ?? "Oops, an error has occurred while saving your settings. Please try again";
        setBannerError(message);
        addToast({
          title: "Error",
          description: message,
          color: "danger",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="text-lg font-medium">Instance details</div>
        <form
          className="grid grid-col w-full grid-cols-1 items-center justify-between gap-8 md:grid-cols-2 lg:grid-cols-3"
          onSubmit={handleSubmit}
        >
          <Input
            id="instanceName"
            type="text"
            name="instanceName"
            label="Name of Instance"
            labelPlacement="outside"
            value={formData.instanceName ?? ""}
            onValueChange={(value) => handleFormChange("instanceName", value)}
            isInvalid={Boolean(fieldErrors.instanceName)}
            errorMessage={fieldErrors.instanceName}
          />
          <Input
            id="email"
            type="email"
            name="email"
            label="Email"
            labelPlacement="outside"
            value={instanceAdmins[0]?.user.email ?? ""}
            isDisabled
            disableAnimation
          />
          <Input
            id="instanceId"
            type="text"
            name="instanceId"
            label="Instance Id"
            labelPlacement="outside"
            value={instance.id ?? ""}
            isDisabled
            disableAnimation
          />
          <div className="space-y-3">
            <div className="text-lg font-medium">Chat + telemetry</div>
            <IntercomConfig isTelemetryEnabled={formData.isTelemetryEnabled ?? false} />
            <div className="flex items-center gap-14 px-4 py-3 border border-custom-border-200 rounded">
              <div className="grow flex items-center gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-custom-background-90 rounded-full">
                    <Telescope className="w-6 h-6 text-custom-text-300/80 p-0.5" />
                  </div>
                </div>
                <div className="grow">
                  <div className="text-xs font-normal text-custom-text-300 leading-5">
                    Let SyncTurtle collect anonymous usage data
                  </div>
                  <div className="text-xs font-normal text-custom-text-300 leading-5">
                    No PII is collected. This anonymized data is used to understan how you use SyncTurtle and build new
                    features in line with{" "}
                    <a href="#" className="text-custom-primary-100 hover:underline">
                      our Telemetry Policy.
                    </a>
                  </div>
                </div>
              </div>
              <div className={`shrink-0 ${isSubmitting && "opacity-70"}`}>
                <Switch
                  isSelected={formData.isTelemetryEnabled ?? false}
                  onValueChange={(value) => handleFormChange("isTelemetryEnabled", value)}
                  size="sm"
                  isDisabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="col-span-full mt-4">
            <Button color="primary" size="sm" isDisabled={!isDirty || isSubmitting} isLoading={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
