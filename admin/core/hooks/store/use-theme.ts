import { StoreContext } from "@/lib/store-context";
import { useContext, useSyncExternalStore } from "react";

export const useTheme = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useTheme() must be used inside a StoreProvider");
  const snapshot = useSyncExternalStore(
    context.theme.subscribe,
    context.theme.getSnapshot,
    context.theme.getServerSnapshot
  );
  return {
    ...snapshot,
    toggleNewUserPopup: context.theme.toggleNewUserPopup,
    toggleSidebar: context.theme.toggleSidebar,
    setTheme: context.theme.setTheme,
  };
};
