"use client";

import { useInstance } from "@/hooks/store";
import useSWR from "swr";
import { Loader } from "./Loader";
import { addToast, Switch } from "@heroui/react";
import { useState } from "react";
import { TInstanceConfigurationKeys } from "@syncturtle/types";
import { AuthenticationModes } from "@/syncturtle-admin/components/authentication";

export default function Authentication() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // store hooks
  const { fetchInstanceConfigurations, formattedConfig, updateInstanceConfigurations } = useInstance();

  useSWR("INSTANCE_CONFIGURATIONS", () => fetchInstanceConfigurations());

  const enableSignupConfig = formattedConfig?.ENABLE_SIGNUP ?? "";

  const updateConfig = async (key: TInstanceConfigurationKeys, value: string) => {
    setIsSubmitting(true);

    const payload: Partial<typeof formattedConfig> = {
      [key]: value,
    };

    const promise = updateInstanceConfigurations(payload);

    addToast({
      title: "Saving configuration",
      description: "Please wait while we save your changes.",
      color: "primary",
      promise,
    });

    try {
      await promise;
    } catch (error) {
      addToast({
        title: "Failed to update settings",
        description: (error as any)?.message ?? "Something went wrong",
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative container mx-auto w-full h-full p-4 py-4 space-y-6 flex flex-col">
      <div className="border-b border-custom-border-100 mx-4 py-4 space-y-1 flex-shrink-0">
        <div className="text-xl font-medium text-custom-text-100">Manage authentication modes for your instance</div>
        <div className="text-sm font-normal text-custom-text-300">
          Configure authentication modes for your team and restrict sign-ups to be invite only.
        </div>
      </div>
      <div className="flex-grow overflow-hidden overflow-y-scroll vertical-scrollbar scrollbar-md px-4">
        {formattedConfig ? (
          <div className="space-y-3">
            <div className="w-full flex items-center gap-14 rounded">
              <div className="flex grow items-center gap-4">
                <div className="grow">
                  <div className="text-lg font-medium pb-1">Allow anyone to sign up even without an invite</div>
                  <div className="font-normal leading-5 text-custom-text-300 text-xs">
                    Toggling this off will only let users sign up when they are invited
                  </div>
                </div>
              </div>
              <div className={`shrink-0 pr-4 ${isSubmitting && "opacity-70"}`}>
                <Switch
                  isSelected={Boolean(parseInt(enableSignupConfig))}
                  aria-label="Enable envite only switch"
                  size="sm"
                  onValueChange={() => {
                    if (Boolean(parseInt(enableSignupConfig)) === true) {
                      updateConfig("ENABLE_SIGNUP", "0");
                    } else {
                      updateConfig("ENABLE_SIGNUP", "1");
                    }
                  }}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="text-lg font-medium pt-6">Available authentication modes</div>
            <AuthenticationModes disabled={isSubmitting} updateConfig={updateConfig} />
          </div>
        ) : (
          <Loader className="space-y-10">
            <Loader.Item height="50px" width="75%" />
          </Loader>
        )}
      </div>
    </div>
  );
}
