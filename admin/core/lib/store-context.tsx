import { RootStore } from "@/syncturtle-admin/store/root.store";
import { createContext, ReactNode } from "react";

export let rootStore = new RootStore();

export const StoreContext = createContext<RootStore>(rootStore);

const initializeStore = () => {
  const singletonRootStore = rootStore ?? new RootStore();
  // for SSR and/or SSG, always create new store
  if (typeof window === "undefined") {
    console.log("we are inside a server");
    return singletonRootStore;
  }
  // create the store once on the client
  if (!rootStore) {
    console.log("inside !rootStore: ");
    rootStore = singletonRootStore;
  }
  return singletonRootStore;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const store = initializeStore();
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
