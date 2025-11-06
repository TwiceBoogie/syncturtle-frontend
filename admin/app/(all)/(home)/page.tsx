"use client";

import { InstanceSignInForm } from "./sign-in-form";
import { useInstance } from "@/hooks/store";
import { InstanceLoading } from "@/components/instance/loading";
import { InstanceFailureView } from "@/components/instance/instance-fail";
import { InstanceSetupForm } from "@/components/instance/setup-form";

export default function Home() {
  // hooks
  const { instance, error } = useInstance();

  if (!instance && error) {
    return (
      <div className="relative h-full w-full overflow-y-auto px-6 py-10 mx-auto flex justify-center items-center">
        <InstanceLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-full w-full overflow-y-auto px-6 py-10 mx-auto flex justify-center items-center">
        <InstanceFailureView />
      </div>
    );
  }

  if (instance && !instance.isSetupDone) {
    return (
      <div className="relative h-full w-full overflow-y-auto px-6 py-10 mx-auto flex justify-center items-center">
        <InstanceSetupForm />
      </div>
    );
  }

  return (
    <div className="flex-grow container mx-auto max-w-lg px-10 lg:max-w-md lg:px-10 py-10 lg:pt-28 transition-all">
      <div className="relative flex flex-col space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-3xl font-bold text-onboarding-text-100">
            Manage your Sync<span className="text-green-400">turtle</span> instance
          </h3>
          <p className="font-medium text-onboarding-text-400">
            Configure instance-wide settings to secure your instance
          </p>
        </div>
        <InstanceSignInForm />
      </div>
    </div>
  );
}
