import { Listener, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";

type TTheme = "dark" | "light";

export type TThemeSnapshot = {
  // observables
  sidebarCollapsed: boolean | undefined;
};

const initialSnapshot: TThemeSnapshot = {
  sidebarCollapsed: undefined,
};

export interface IThemeStore {
  // required for useSyncExternalStore
  subscribe: (cb: Listener) => Unsub;
  getSnapshot: () => TThemeSnapshot;
  getServerSnapshot: () => TThemeSnapshot;
  // observables
  sidebarCollapsed: boolean | undefined;
  // actions
  toggleSidebar: (collapse?: boolean) => void;
}

export class ThemeStore implements IThemeStore {
  private _snap: TThemeSnapshot = initialSnapshot;
  private emitter: InstanceType<typeof Emitter>;

  constructor() {
    this.emitter = new Emitter();
  }

  // useSyncExternalStore integration
  public subscribe = (cb: Listener): Unsub => this.emitter.subscribe(cb);
  public getSnapshot = (): TThemeSnapshot => this._snap;
  public getServerSnapshot = (): TThemeSnapshot => initialSnapshot;

  // raw getters for state
  get sidebarCollapsed(): boolean | undefined {
    return this._snap.sidebarCollapsed;
  }

  // action
  public toggleSidebar = (collapsed?: boolean) => {
    const next = this.computeNext(this._snap.sidebarCollapsed, collapsed);
    this.set({ sidebarCollapsed: next });
    if (typeof window !== "undefined") {
      localStorage.setItem("app_sidebar_collapsed", next.toString());
    }
  };

  private computeNext(current: boolean | undefined, collapsed?: boolean): boolean {
    if (collapsed === undefined) {
      const prev = current ?? false;
      return !prev;
    }
    return collapsed;
  }

  private set(patch: Partial<TThemeSnapshot>) {
    const prev = this._snap;
    const next = { ...prev, ...patch };

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
