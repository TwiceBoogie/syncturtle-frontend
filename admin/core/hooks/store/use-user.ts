import { StoreContext } from "@/lib/store-context";
import { useContext, useSyncExternalStore } from "react";

export const useUser = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useUser must be used inside StoreProvider");
  const snapshot = useSyncExternalStore(
    context.user.subscribe,
    context.user.getSnapshot,
    context.user.getServerSnapshot
  );
  return {
    ...snapshot,
    fetchCurrentUser: context.user.fetchCurrentUser,
    signOut: context.user.signOut,
  };
};
