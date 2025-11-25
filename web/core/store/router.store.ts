import { Listener, Unsub } from "@syncturtle/types";
import { ParsedUrlQuery } from "node:querystring";
import { Emitter } from "@syncturtle/utils";

type TRouterSnapshot = {
  query: ParsedUrlQuery;
};

const initialRouterSnapshot: TRouterSnapshot = {
  query: {},
};

export interface IRouterStore {
  // required for useSyncExternalStore
  subscribe: (cb: Listener) => Unsub;
  getSnapshot: () => TRouterSnapshot;
  getServerSnapshot: () => TRouterSnapshot;
  // observable
  query: ParsedUrlQuery;
  // actions
  setQuery: (query: ParsedUrlQuery) => void;
  // computed
  workspaceSlug: string | undefined;
  userId: string | undefined;
}

export class RouterStore implements IRouterStore {
  private _snap: TRouterSnapshot = initialRouterSnapshot;
  private emitter: InstanceType<typeof Emitter>;

  constructor() {
    this.emitter = new Emitter();
  }

  // useExternalSyncStore integration
  public subscribe = (cb: Listener): Unsub => this.emitter.subscribe(cb);
  public getSnapshot = (): TRouterSnapshot => this._snap;
  public getServerSnapshot = (): TRouterSnapshot => this._snap;

  get query(): ParsedUrlQuery {
    return this._snap.query;
  }

  get workspaceSlug() {
    return this.getQueryValue("workspaceSlug");
  }

  get userId() {
    return this.getQueryValue("userId");
  }

  // actions
  public setQuery = (query: ParsedUrlQuery) => {
    this.set({ query });
  };

  private getQueryValue(key: keyof ParsedUrlQuery): string | undefined {
    const value = this._snap.query?.[key];
    if (Array.isArray(value)) {
      return value[0]?.toString();
    }
    return value?.toString();
  }

  private set(patch: Partial<TRouterSnapshot>) {
    const prev = this._snap;
    const next: TRouterSnapshot = { ...prev, ...patch };

    let changed = false;
    for (const key in next) {
      const k = key as keyof TRouterSnapshot;
      if (!Object.is(next[k], prev[k])) {
        changed = true;
        break;
      }
    }

    if (!changed) {
      // no operations, don't emit
      return;
    }

    this._snap = next;
    this.emitter.emit();
  }
}
