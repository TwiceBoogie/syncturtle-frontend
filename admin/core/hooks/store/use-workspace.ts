import { StoreContext } from "@/lib/store-context";
import { useContext, useSyncExternalStore } from "react";

export const useWorkspace = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useWorkspace must be called inside a StoreProvider");
  }
  const snapshot = useSyncExternalStore(
    context.workspace.subscribe,
    context.workspace.getSnapshot,
    context.workspace.getServerSnapshot
  );
  return {
    ...snapshot,
    getWorkspaceById: context.workspace.getWorkspaceById,
    fetchWorkspaces: context.workspace.fetchWorkspaces,
    fetchNextWorkspaces: context.workspace.fetchNextWorkspaces,
    createWorkspace: context.workspace.createWorkspace,
  };
};
