"use client";

import { useInstance } from "@/hooks/store";
import { GeneralForm } from "./form";

export default function General() {
  const { instance, instanceAdmins } = useInstance();

  return (
    <div className="relative container mx-auto w-full h-full p-4 py-4 space-y-6 flex flex-col">
      <div className="border-b border-custom-border-100 mx-4 py-4 space-y-1 flex-shrink-0">
        <div className="text-xl font-medium text-custom-text-100">General settings</div>
        <div className="text-sm font-normal text-custom-text-300">
          Change the name of your instance and instance admin e-email addresses.
        </div>
      </div>
      <div className="flex-grow overflow-hidden px-4">
        {instance && instanceAdmins && <GeneralForm instance={instance} instanceAdmins={instanceAdmins} />}
      </div>
    </div>
  );
}
