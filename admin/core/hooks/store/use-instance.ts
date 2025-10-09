import { StoreContext } from "@/lib/store-context";
import { useContext, useSyncExternalStore } from "react";

export const useInstance = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useInstance must be called inside a StoreProvider");
  }

  const snapshot = useSyncExternalStore(
    context.instance.subscribe,
    context.instance.getSnapshot,
    context.instance.getServerSnapshot
  );
  return {
    ...snapshot,
    fetchInstanceInfo: context.instance.fetchInstanceInfo,
    fetchInstanceAdmins: context.instance.fetchInstanceAdmins,
  };
};
