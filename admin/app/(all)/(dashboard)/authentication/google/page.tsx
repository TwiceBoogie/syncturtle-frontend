"use client";

import { useState } from "react";
import Image from "next/image";
// heroui
import { addToast } from "@heroui/toast";
import { Switch } from "@heroui/switch";
// components
import { AuthenticationMethodCard } from "@/components/authentication/authentication-method-card";
// store hooks
import { useInstance } from "@/hooks/store";
// assets
import GoogleLogo from "@/public/logos/google-logo.svg";
// types
import { TInstanceConfigurationKeys } from "@syncturtle/types";
import { InstanceGoogleConfigForm } from "./form";
import { Loader } from "../Loader";
import useSWR from "swr";

export default function Google() {
  // state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // store hook
  const { formattedConfig, updateInstanceConfigurations, fetchInstanceConfigurations } = useInstance();

  const enableGoogleConfig = formattedConfig?.IS_GOOGLE_ENABLED ?? "";

  useSWR("INSTANCE_CONFIGURATIONS", () => fetchInstanceConfigurations());

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
    <div className="relative container mx-auto w-full p-4 py-4 space-y-6 flex flex-col">
      <div className="border-b border-custom-border-100 mx-4 py-4 space-y-1 flex-shrink-0">
        <AuthenticationMethodCard
          name="Google"
          description="Allow members to login or sign up to Synturtle with their Google accounts."
          icon={<Image src={GoogleLogo} height={24} width={24} alt="Google Logo" />}
          config={
            <Switch
              isSelected={Boolean(parseInt(enableGoogleConfig))}
              aria-label="Enable Google login switch"
              isDisabled={isSubmitting || !formattedConfig}
              onValueChange={() => {
                if (Boolean(parseInt(enableGoogleConfig))) {
                  updateConfig("IS_GOOGLE_ENABLED", "0");
                } else {
                  updateConfig("IS_GOOGLE_ENABLED", "1");
                }
              }}
              size="sm"
            />
          }
          disabled={isSubmitting || !formattedConfig}
          withBorder={false}
        />
      </div>
      <div>
        {formattedConfig ? (
          <InstanceGoogleConfigForm config={formattedConfig} />
        ) : (
          <Loader className="space-y-8">
            <Loader.Item height="50px" width="25%" />
            <Loader.Item height="50px" />
            <Loader.Item height="50px" />
            <Loader.Item height="50px" />
            <Loader.Item height="50px" width="50%" />
          </Loader>
        )}
      </div>
    </div>
  );
}
