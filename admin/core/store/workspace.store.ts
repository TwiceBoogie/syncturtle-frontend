import { ICreateWorkspace, WorkspaceService } from "@/services/workspace.service";
import { IWorkspace, Listener, TPaginationInfo, Unsub } from "@syncturtle/types";

import { Emitter } from "@syncturtle/utils";

type TLoader = "init-loader" | "mutation" | "pagination" | "loaded" | undefined;

type TWorkspaceSnapshot = {
  loader: TLoader;
  workspaces: Record<string, IWorkspace>;
  paginationInfo: TPaginationInfo | undefined;
  workspacesVersion: number; // used only for caching workspaceIds
};

const initialSnapshot: TWorkspaceSnapshot = {
  loader: "init-loader",
  workspaces: {},
  paginationInfo: undefined,
  workspacesVersion: 0,
};

export interface IWorkspaceStoreInternal {
  // required for useSyncExternalStore
  _subscribe(cb: () => void): Unsub;
  _getSnapshot(): TWorkspaceSnapshot;
  _getServerSnapshot(): TWorkspaceSnapshot;
  // observables
  loader: TLoader;
  workspaces: Record<string, IWorkspace>;
  paginationInfo: TPaginationInfo | undefined;
  // computed
  workspaceIds: string[];
  // actions
  hydrate: (data: Record<string, IWorkspace>) => void;
  getWorkspaceById: (workspaceId: string) => IWorkspace | undefined;
  fetchWorkspaces: () => Promise<IWorkspace[]>;
  fetchNextWorkspaces: () => Promise<IWorkspace[]>;
  createWorkspace: (data: ICreateWorkspace) => Promise<IWorkspace>;
  reset: () => void;
}

export type TWorkspaceStore = Omit<IWorkspaceStoreInternal, "_subscribe" | "_getSnapshot" | "_getServerSnapshot">;

export class WorkspaceStore implements IWorkspaceStoreInternal {
  private _snap: TWorkspaceSnapshot = initialSnapshot;
  private emitter: InstanceType<typeof Emitter>;

  // external deps
  private workspaceService: WorkspaceService;

  constructor() {
    this.emitter = new Emitter();

    this.workspaceService = new WorkspaceService();
  }

  public hydrate = (data: Record<string, IWorkspace>): void => {
    if (!data) return;
    this.set({ workspaces: { ...data } });
  };

  // useSyncExternalStore integration
  /** @internal */
  public _subscribe = (cb: () => void): Unsub => this.emitter.subscribe(cb);
  /** @internal */
  public _getSnapshot = (): TWorkspaceSnapshot => this._snap;
  /** @internal */
  public _getServerSnapshot = (): TWorkspaceSnapshot => this._snap;

  // raw getters for state
  get loader(): TLoader {
    return this._snap.loader;
  }

  get workspaces(): Record<string, IWorkspace> {
    return this._snap.workspaces;
  }

  get paginationInfo(): TPaginationInfo | undefined {
    return this._snap.paginationInfo;
  }

  // cached compute: workspaceIds
  private _cacheWorkspaceIds?: {
    workspacesVersion: number;
    value: string[];
  };

  get workspaceIds(): string[] {
    const { workspacesVersion, workspaces } = this._snap;

    const cached = this._cacheWorkspaceIds;
    if (cached && cached.workspacesVersion === workspacesVersion) {
      return cached.value;
    }

    const value = Object.keys(workspaces);

    this._cacheWorkspaceIds = {
      workspacesVersion,
      value,
    };

    return value;
  }

  public getWorkspaceById = (workspaceId: string): IWorkspace | undefined => {
    return this._snap.workspaces[workspaceId];
  };

  // fetch actions
  public fetchWorkspaces = async (): Promise<IWorkspace[]> => {
    try {
      if (this.workspaceIds.length > 0) {
        this.set({ loader: "mutation" });
      } else {
        this.set({ loader: "init-loader" });
      }

      const paginationData = await this.workspaceService.list();
      console.log(paginationData);
      const { results, ...paginationInfo } = paginationData;

      const nextMap: Record<string, IWorkspace> = {};
      for (const ws of results) {
        nextMap[ws.id] = ws;
      }

      this.set({
        workspaces: nextMap,
        paginationInfo: paginationInfo as TPaginationInfo,
        loader: "loaded",
      });

      return results;
    } catch (error) {
      this.set({ loader: "loaded" });
      console.error("Error fetching workspaces", error);
      throw error;
    }
  };

  public fetchNextWorkspaces = async (): Promise<IWorkspace[]> => {
    const page = this.paginationInfo;
    if (!page || page.nextPageResults === false) return [];

    try {
      this.set({ loader: "pagination" });
      const { results, ...paginationInfo } = await this.workspaceService.list(page.nextCursor);

      // merge
      const nextMap = { ...this._snap.workspaces };
      for (const ws of results) {
        nextMap[ws.id] = ws;
      }

      this.set({
        workspaces: nextMap,
        paginationInfo: paginationInfo as TPaginationInfo,
        loader: "loaded",
      });

      return results;
    } catch (error) {
      this.set({ loader: "loaded" });
      console.error("Erorr fetching next workspaces", error);
      throw error;
    }
  };

  // crud actions
  public createWorkspace = async (data: ICreateWorkspace): Promise<IWorkspace> => {
    try {
      this.set({ loader: "mutation" });

      const workspace = await this.workspaceService.create(data);

      const nextMap = { ...this._snap.workspaces };
      nextMap[workspace.id] = workspace;

      this.set({ workspaces: nextMap });

      return workspace;
    } catch (error) {
      console.error("Error creating workspace", error);
      throw error;
    } finally {
      this.set({ loader: "loaded" });
    }
  };

  public reset = () => {
    this._snap = { ...initialSnapshot };
    this._cacheWorkspaceIds = undefined;
    this.emitter.emit();
  };

  private set(patch: Partial<TWorkspaceSnapshot>) {
    const prev = this._snap;
    let next: TWorkspaceSnapshot = { ...prev, ...patch };

    // bump workspacesVersion when workspaces changes
    if (Object.prototype.hasOwnProperty.call(patch, "workspaces") && !Object.is(prev.workspaces, next.workspaces)) {
      next = {
        ...next,
        workspacesVersion: prev.workspacesVersion + 1,
      };
      this._cacheWorkspaceIds = undefined;
    }

    let changed = false;
    for (const key in next) {
      const k = key as keyof TWorkspaceSnapshot;
      if (!Object.is(next[k], prev[k])) {
        changed = true;
        break;
      }
    }

    if (!changed) return;

    this._snap = next;
    this.emitter.emit();
  }
}
