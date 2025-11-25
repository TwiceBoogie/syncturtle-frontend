import { StoreContext } from "@/lib/store-context";
import { IThemeStoreInternal, TThemeStore } from "@/store/theme.store";
import { useContext, useSyncExternalStore } from "react";

export const useTheme = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useTheme() must be used inside a StoreProvider");

  const store = context.theme as IThemeStoreInternal;
  useSyncExternalStore(store._subscribe, store._getSnapshot, store._getServerSnapshot);

  return store as TThemeStore;
};
