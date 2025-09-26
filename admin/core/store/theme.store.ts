import { Listener, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";

type TTheme = "dark" | "light";
type TSnapshot = {
  isNewUserPopup: boolean;
  theme: TTheme | undefined;
  isSidebarCollapsed: boolean | undefined;
};

export interface IThemeStore {
  // uSES
  subscribe: (cb: Listener) => Unsub;
  getSnapshot: () => TSnapshot;
  getServerSnapshot: () => TSnapshot;
  toggleNewUserPopup: () => void;
  toggleSidebar: (collapsed: boolean) => void;
  setTheme: (currentTheme: TTheme) => void;
}

const initial: TSnapshot = {
  isNewUserPopup: false,
  theme: undefined,
  isSidebarCollapsed: undefined,
};

export class ThemeStore implements IThemeStore {
  // private
  private _snap: TSnapshot = initial;
  private emitter: Emitter;

  constructor() {
    this.emitter = new Emitter();
  }

  public subscribe = (cb: Listener): Unsub => this.emitter.subscribe(cb);
  public getSnapshot = (): TSnapshot => this._snap;
  public getServerSnapshot = (): TSnapshot => initial;

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

  private set(patch: Partial<TSnapshot>) {
    this._snap = { ...this._snap, ...patch };
    this.emitter.emit();
  }
}
