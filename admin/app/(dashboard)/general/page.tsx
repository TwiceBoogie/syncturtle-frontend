"use client";

import { Button, Input } from "@heroui/react";

export default function General() {
  return (
    <div className="relative container mx-auto w-full h-full p-4 py-4 space-y-6 flex flex-col">
      <div className="border-b border-custom-border-100 mx-4 py-4 space-y-1 flex-shrink-0">
        <div className="text-xl font-medium text-custom-text-100">General settings</div>
        <div className="text-sm font-normal text-custom-text-300">
          Change the name of your instance and instance admin e-email addresses.
        </div>
      </div>
      <div className="flex-grow overflow-hidden px-4">
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-lg font-medium">Instance details</div>
            <div className="grid grid-col w-full grid-cols-1 items-center justify-between gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Input
                id="instanceName"
                type="text"
                name="instanceName"
                label="Name of Instance"
                labelPlacement="outside"
              />
              <Input
                id="email"
                type="email"
                name="email"
                label="Email"
                labelPlacement="outside"
                value={"luna@snow.com"}
                isDisabled
                disableAnimation
              />
              <Input
                id="instanceId"
                type="text"
                name="instanceId"
                label="Instance Id"
                labelPlacement="outside"
                value={"1234567890"}
                isDisabled
                disableAnimation
              />
            </div>
          </div>
          <Button>Saving...</Button>
        </div>
      </div>
    </div>
  );
}
