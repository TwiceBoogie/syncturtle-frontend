import { StoreContext } from "@/lib/store-context";
import { useContext, useSyncExternalStore } from "react";

export const useUserProfile = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useUserProfile must be used insida a StoreProvider");
  const snapshot = useSyncExternalStore(
    context.user.userProfile.subscribe,
    context.user.userProfile.getSnapshot,
    context.user.userProfile.getServerSnapshot
  );
  return {
    ...snapshot,
    fetchUserProfile: context.user.userProfile.fetchUserProfile,
  };
};
