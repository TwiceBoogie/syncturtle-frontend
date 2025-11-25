import { StoreContext } from "@/lib/store-context";
import { IUserStore } from "@/store/user";
import { useContext, useSyncExternalStore } from "react";

export const useUser = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useUser must be used inside StoreProvider");

  const store: IUserStore = context.user;
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return store;
};
