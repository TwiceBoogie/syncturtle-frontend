import { RootStore } from "@/syncturtle-web/store/root.store";
import { createContext, ReactNode, useMemo, useRef } from "react";

// browser only cache; so no store at module load
let rootStore: RootStore | null = null;

export const StoreContext = createContext<RootStore | null>(rootStore);

const initializeStore = (initialData = {}): RootStore => {
  const _store = rootStore ?? new RootStore();

  if (initialData) {
    _store.hydrate(initialData);
  }
  // for SSR and/or SSG, always create new store
  // no cross request sharing
  if (typeof window === "undefined") {
    return _store;
  }
  // create the store once on the client
  if (!rootStore) rootStore = _store;
  return _store;
};

export type StoreProviderProps = {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: any;
};

export const StoreProvider = ({ children, initialState = {} }: StoreProviderProps) => {
  // ensure on einstance per mounted provider
  // const storeRef = useRef<RootStore | null>(null);
  // if (!storeRef.current) storeRef.current = initializeStore(initialState);

  // // stable value for provider
  // const value = useMemo(() => storeRef.current!, []);
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
