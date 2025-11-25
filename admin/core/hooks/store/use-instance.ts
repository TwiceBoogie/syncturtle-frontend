import { StoreContext } from "@/lib/store-context";
import { TInstanceStore, IInstanceStoreInternal } from "@/store/instance.store";
import { useContext, useSyncExternalStore } from "react";

/**
 *
 * @returns
 */
export const useInstance = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useInstance must be called inside a StoreProvider");
  }

  const store = context.instance as IInstanceStoreInternal;
  useSyncExternalStore(store._subscribe, store._getSnapshot, store._getServerSnapshot);

  return store as TInstanceStore;
};
