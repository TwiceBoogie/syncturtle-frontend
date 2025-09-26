import { Listener, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";

type TTheme = "dark" | "light";
export type TSnapshot = {
  theme: TTheme | undefined;
  isSidebarCollapsed: boolean | undefined;
};

const initial: TSnapshot = {
  theme: undefined,
  isSidebarCollapsed: undefined,
};

export interface IThemeStore {
  // uSES
  subscribe: (cb: Listener) => Unsub;
  getSnapshot: () => TSnapshot;
  getServerSnapshot: () => TSnapshot;
  toggleSidebar: (collapse?: boolean) => void;
  setTheme: (currentTheme: TTheme) => void;
}

export class ThemeStore implements IThemeStore {
  // PRIVATE
  private _snap: TSnapshot = initial;
  private emitter: Emitter;

  constructor() {
    this.emitter = new Emitter();
  }

  public subscribe = (cb: Listener): Unsub => this.emitter.subscribe(cb);
  public getSnapshot = (): TSnapshot => this._snap;
  public getServerSnapshot = (): TSnapshot => initial;
  public toggleSidebar = (collapsed?: boolean) => {
    const next = typeof collapsed === "boolean" ? collapsed : !this._snap.isSidebarCollapsed;
    this.set({ isSidebarCollapsed: next });
    try {
      localStorage.setItem("app_sidebar_collapsed", String(next));
    } catch (error) {}
  };

  public setTheme = (currentTheme: TTheme) => {
    try {
      localStorage.setItem("theme", currentTheme);
    } catch (error) {
      console.error("setting user theme error", error);
    }
  };

  private set(patch: Partial<TSnapshot>) {
    this._snap = { ...this._snap, ...patch };
    this.emitter.emit();
  }
}
