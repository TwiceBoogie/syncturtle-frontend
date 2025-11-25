import { StoreContext } from "@/lib/store-context";
import { IRouterStore } from "@/store/router.store";
import { useContext, useSyncExternalStore } from "react";

export const useRouterParams = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useRouterParams must be used within StoreProvider");
  }

  const store: IRouterStore = context.router;

  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return store;
};
