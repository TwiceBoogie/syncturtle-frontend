import { RootStore } from "@/syncturtle-web/store/root.store";
import { createContext, ReactElement } from "react";

export let rootStore = new RootStore();

export const StoreContext = createContext<RootStore>(rootStore);

const initializeStore = () => {
  const newRootStore = rootStore ?? new RootStore();
  if (typeof window === "undefined") return newRootStore;
  if (!rootStore) rootStore = newRootStore;
  return newRootStore;
};

export const store = initializeStore();

export const StoreProvider = ({ children }: { children: ReactElement }) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);
