import { StoreContext } from "@/lib/store-context";
import { IThemeStore } from "@/store/theme.store";
import { useContext, useSyncExternalStore } from "react";

export const useAppTheme = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useAppTheme must be used inside a StoreProvider");

  const store: IThemeStore = context.theme;
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return store;
};
