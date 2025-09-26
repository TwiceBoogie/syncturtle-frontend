import { StoreContext } from "@/lib/store-context";
import { useContext, useSyncExternalStore } from "react";

export const useAppTheme = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useAppTheme must be used inside a StoreProvider");
  const snapshot = useSyncExternalStore(
    context.theme.subscribe,
    context.theme.getSnapshot,
    context.theme.getServerSnapshot
  );
  return {
    ...snapshot,
    toggleSidebar: context.theme.toggleSidebar,
    setTheme: context.theme.setTheme,
  };
};
