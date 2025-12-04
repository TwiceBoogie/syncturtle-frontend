import { StoreContext } from "@/lib/store-context";
import { IUserSettingsStoreInternal, TUserSettingsStore } from "@/store/user/settings.store";
import { useContext, useSyncExternalStore } from "react";

export const useUserSettings = (): TUserSettingsStore => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useUserSettings must be used inside a StoreProvider");
  }

  const store = context.user.userSettings as IUserSettingsStoreInternal;
  useSyncExternalStore(store._subscribe, store._getSnapshot, store._getServerSnapshot);

  return store as TUserSettingsStore;
};
