import { useContext, useSyncExternalStore } from "react";
import { StoreContext } from "@/lib/store-context";
import { IProfileStoreInternal, TProfileStore } from "@/store/user/profile.store";

export const useUserProfile = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useUserProfile must be used insida a StoreProvider");

  const store = context.user.userProfile as IProfileStoreInternal;
  useSyncExternalStore(store._subscribe, store._getSnapshot, store._getServerSnapshot);

  return store as TProfileStore;
};
