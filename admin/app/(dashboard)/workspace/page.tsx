"use client";

import { Switch } from "@heroui/react";

export default function Workspace() {
  return (
    <div className="relative container mx-auto w-full h-full p-4 py-4 space-y-6 flex flex-col">
      <div className="border-b border-custom-border-100 mx-4 py-4 space-y-1 flex-shrink-0">
        <div className="text-xl font-medium text-custom-text-100">Workspace on this settings</div>
        <div className="text-sm font-normal text-custom-text-300">
          See all workspaces and control who can create them.
        </div>
      </div>
      <div className="flex-grow overflow-hidden px-4">
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-4">
              <div className="grow">
                <div className="text-lg font-medium pb-1">Prevent anyone else from creating a workspace.</div>
                <div className="font-normal leading-5 text-custom-text-300 text-xs">
                  Toggling this on will let only you create workspaces. You will have to invite users to new workspaces.
                </div>
              </div>
              <Switch defaultSelected aria-label="Automatic updates" size="sm" />
            </div>
          </div>
          <div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
