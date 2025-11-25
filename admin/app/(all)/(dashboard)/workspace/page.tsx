"use client";

import { useState } from "react";
import useSWR from "swr";
// heroui
import { Spinner } from "@heroui/spinner";
import { Switch } from "@heroui/switch";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";
// store hooks
import { useInstance, useWorkspace } from "@/hooks/store";
// types
import { LoaderIcon } from "lucide-react";
import { Link } from "@heroui/link";
import { TInstanceConfigurationKeys } from "@syncturtle/types";
import { WorkspaceListItem } from "@/components/workspace/list-workspace";

export default function Workspace() {
  // states
  const [isSubmitting, setIsSubmitting] = useState(false);
  // hooks
  const { formattedConfig, fetchInstanceConfigurations, updateInstanceConfigurations } = useInstance();
  const {
    workspaceIds,
    loader: workspaceLoader,
    paginationInfo,
    fetchWorkspaces,
    fetchNextWorkspaces,
  } = useWorkspace();

  const disableWorkspaceCreation = formattedConfig?.DISABLE_WORKSPACE_CREATION ?? "";
  const hasNextPage = paginationInfo?.nextPageResults && paginationInfo?.nextCursor !== undefined;

  useSWR("INSTANCE_CONFIGURATIONS", () => fetchInstanceConfigurations());
  useSWR("INSTANCE_WORKSPACES", () => fetchWorkspaces());

  const updateConfig = async (key: TInstanceConfigurationKeys, value: string) => {
    setIsSubmitting(true);
    const payload: Partial<typeof formattedConfig> = {
      [key]: value,
    };

    const promise = updateInstanceConfigurations(payload);

    addToast({
      title: "Updating workspace settings",
      description: "Please wait while we save your changes.",
      color: "primary",
      severity: "primary",
      promise,
      loadingComponent: <Spinner size="sm" />,
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
        <div className="text-xl font-medium text-custom-text-100">Workspace on this settings</div>
        <div className="text-sm font-normal text-custom-text-300">
          See all workspaces and control who can create them.
        </div>
      </div>
      <div className="flex-grow overflow-hidden px-4">
        <div className="space-y-3">
          {formattedConfig ? (
            <div className="w-full flex items-center gap-14 rounded">
              <div className="flex grow items-center gap-4">
                <div className="grow">
                  <div className="text-lg font-medium pb-1">Prevent anyone else from creating a workspace.</div>
                  <div className="font-normal leading-5 text-custom-text-300 text-xs">
                    Toggling this on will let only you create workspaces. You will have to invite users to new
                    workspaces.
                  </div>
                </div>
                <Switch
                  isSelected={Boolean(parseInt(disableWorkspaceCreation))}
                  aria-label="Disable workspace switch"
                  size="sm"
                  onValueChange={() => {
                    if (Boolean(parseInt(disableWorkspaceCreation)) === true) {
                      updateConfig("DISABLE_WORKSPACE_CREATION", "0");
                    } else {
                      updateConfig("DISABLE_WORKSPACE_CREATION", "1");
                    }
                  }}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          ) : (
            <Spinner label="Loading..." />
          )}
          {workspaceLoader !== "init-loader" ? (
            <>
              <div className="pt-6 flex items-center justify-between gap-2">
                <div className="flex flex-col items-start gap-x-2">
                  <div className="flex items-center gap-2 text-lg font-medium">
                    All workspaces on this instance{" "}
                    <span className="text-custom-text-300">• {workspaceIds.length}</span>
                    {workspaceLoader && ["mutation", "pagination"].includes(workspaceLoader) && (
                      <LoaderIcon className="w-4 h-4 animate-spin" />
                    )}
                  </div>
                  <div className="font-normal leading-5 text-custom-text-300 text-xs">
                    You can't yet delete workspaces and you can only go to the workspace if you are an Admin or a
                    Member.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/workspace/create`} size="sm">
                    Create workspace
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-4 py-2">
                {workspaceIds.map((workspaceId) => (
                  <WorkspaceListItem key={workspaceId} workspaceId={workspaceId} />
                ))}
              </div>
              {hasNextPage && (
                <Button color="primary" onPress={fetchNextWorkspaces} isDisabled={workspaceLoader === "pagination"}>
                  Load more
                </Button>
              )}
            </>
          ) : (
            <Spinner label="Loading..." />
          )}
        </div>
      </div>
    </div>
  );
}
