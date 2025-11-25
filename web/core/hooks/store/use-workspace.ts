import { StoreContext } from "@/lib/store-context";
import { IWorkspaceStore } from "@/store/workspace";
import { useContext, useSyncExternalStore } from "react";

export const useWorkspace = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useWorkspace must be used inside a StoreProvider");
  }

  const store: IWorkspaceStore = context.workspace;

  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return store;
};
