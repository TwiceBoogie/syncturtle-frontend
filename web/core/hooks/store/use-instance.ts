import { StoreContext } from "@/lib/store-context";
import { IInstanceStore } from "@/store/instance.store";
import { useContext, useSyncExternalStore } from "react";

export const useInstance = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useInstance must be within a StoreProvider");

  const store: IInstanceStore = context.instance;
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return store;
};
