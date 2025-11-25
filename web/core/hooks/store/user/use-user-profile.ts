import { StoreContext } from "@/lib/store-context";
import { IProfileStore } from "@/store/user/profile.store";
import { useContext, useSyncExternalStore } from "react";

export const useUserProfile = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useUserProfile must be used insida a StoreProvider");

  const store: IProfileStore = context.user.userProfile;
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return store;
};
