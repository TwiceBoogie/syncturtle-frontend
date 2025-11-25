import { Listener, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";

type TTheme = "dark" | "light";
type TThemeSnapshot = {
  isNewUserPopup: boolean;
  theme: TTheme | undefined;
  isSidebarCollapsed: boolean | undefined;
};

export interface IThemeStoreInternal {
  // required for useSyncExternalStore
  _subscribe: (cb: Listener) => Unsub;
  _getSnapshot: () => TThemeSnapshot;
  _getServerSnapshot: () => TThemeSnapshot;
  // observables
  isNewUserPopup: boolean;
  theme: TTheme | undefined;
  isSidebarCollapsed: boolean | undefined;
  // actions
  toggleNewUserPopup: () => void;
  toggleSidebar: (collapsed: boolean) => void;
  setTheme: (currentTheme: TTheme) => void;
}

export type TThemeStore = Omit<IThemeStoreInternal, "_subscribe" | "_getSnapshot" | "_getServerSnapshot">;

const initialSnapshot: TThemeSnapshot = {
  isNewUserPopup: false,
  theme: undefined,
  isSidebarCollapsed: undefined,
};

export class ThemeStore implements IThemeStoreInternal {
  private _snap: TThemeSnapshot = initialSnapshot;
  private emitter: InstanceType<typeof Emitter>;

  constructor() {
    this.emitter = new Emitter();
  }

  // useSyncExternalStore integration
  /** @internal */
  public _subscribe = (cb: Listener): Unsub => this.emitter.subscribe(cb);
  /** @internal */
  public _getSnapshot = (): TThemeSnapshot => this._snap;
  /** @internal */
  public _getServerSnapshot = (): TThemeSnapshot => initialSnapshot;

  // raw getters for state
  get isNewUserPopup(): boolean {
    return this._snap.isNewUserPopup;
  }

  get theme(): TTheme | undefined {
    return this._snap.theme;
  }

  get isSidebarCollapsed(): boolean | undefined {
    return this._snap.isSidebarCollapsed;
  }

  // actions
  public toggleNewUserPopup = () => {
    this.set({ isNewUserPopup: !this._snap.isNewUserPopup });
  };

  public toggleSidebar = (collapsed?: boolean) => {
    const next = typeof collapsed === "boolean" ? collapsed : !this._snap.isSidebarCollapsed; // ! undefined === true on first toggle
    this.set({ isSidebarCollapsed: next });
    try {
      localStorage.setItem("god_mode_sidebar_collapsed", String(next));
    } catch (error) {}
  };

  public setTheme = (currentTheme: TTheme) => {
    try {
      localStorage.setItem("theme", currentTheme);
    } catch (error) {
      console.error("setting user theme error", error);
    }
    this.set({ theme: currentTheme });
  };

  private set(patch: Partial<TThemeSnapshot>) {
    const prev = this._snap;
    const next: TThemeSnapshot = { ...prev, ...patch };

    let changed = false;
    for (const key in next) {
      const k = key as keyof TThemeSnapshot;
      if (!Object.is(next[k], prev[k])) {
        changed = true;
        break;
      }
    }

    if (!changed) {
      return;
    }

    this._snap = next;
    this.emitter.emit();
  }
}
