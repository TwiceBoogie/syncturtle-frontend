import { WorkspaceService } from "@/services/workspace.service";
import { IWorkspace, Listener, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";
import { CoreRootStore } from "../root.store";

type TWorkspaceSnapshot = {
  loader: boolean;
  workspaces: Record<string, IWorkspace>;
  currentWorkspace: IWorkspace | null;
  workspaceCreatedByCurrentUser: IWorkspace[] | null;
  // navigationPreferencesMap: Record<string, IWorkspaceSidebarNavigation>;
  // vesrion counters for cached computed values
  workspacesVersion: number;
};

const initialSnapshot: TWorkspaceSnapshot = {
  loader: false,
  workspaces: {},
  currentWorkspace: null,
  workspaceCreatedByCurrentUser: null,
  workspacesVersion: 0,
};

export interface IWorkspaceStore {
  // required for useSyncExternalStore
  subscribe: (cb: Listener) => Unsub;
  getSnapshot: () => TWorkspaceSnapshot;
  getServerSnapshot: () => TWorkspaceSnapshot;
  // observables
  loader: boolean;
  workspaces: Record<string, IWorkspace>;
  // computed
  currentWorkspace: IWorkspace | null;
  workspacesCreatedByCurrentUser: IWorkspace[] | null;
  // computed actions
  getWorkspaceBySlug: (workspaceSlug: string) => IWorkspace | null;
  getWorkspaceById: (workspaceId: string) => IWorkspace | null;
  // fetch actions
  fetchWorkspaces: () => Promise<IWorkspace[]>;
  // crud actions
  //   createWorkspace: (data: Partial<IWorkspace>) => Promise<IWorkspace>;
  //   updateWorkspace: (workspaceSlug: string, data: Partial<IWorkspace>) => Promise<IWorkspace>;
  //   updateWorkspaceLogo: (workspaceSlug: string, logoURL: string) => void;
  //   deleteWorkspace: (workspaceSlug: string) => Promise<void>;
}

export class WorkspaceStore implements IWorkspaceStore {
  private _snap: TWorkspaceSnapshot = initialSnapshot;
  private emitter: InstanceType<typeof Emitter>;

  // external deps
  private workspaceService: WorkspaceService;
  private router: CoreRootStore["router"];
  private user: CoreRootStore["user"];
  // sub-stores

  constructor(private _rootStore: CoreRootStore) {
    this.emitter = new Emitter();

    this.workspaceService = new WorkspaceService();
    this.router = _rootStore.router;
    this.user = _rootStore.user;
  }

  // useSyncExternalStore integration
  public subscribe = (cb: Listener): Unsub => this.emitter.subscribe(cb);
  public getSnapshot = (): TWorkspaceSnapshot => this._snap;
  public getServerSnapshot = (): TWorkspaceSnapshot => this._snap;

  // raw getters for state
  get loader(): boolean {
    return this._snap.loader;
  }

  get workspaces(): Record<string, IWorkspace> {
    return this._snap.workspaces;
  }

  // cached computed: currentWorkspace
  private _cacheCurrentWorkspace?: {
    workspacesVersion: number;
    workspaceSlug: string | undefined;
    value: IWorkspace | null;
  };

  get currentWorkspace(): IWorkspace | null {
    const workspaceSlug = this.router.workspaceSlug;
    if (!workspaceSlug) {
      return null;
    }

    const { workspacesVersion } = this._snap;

    const cached = this._cacheCurrentWorkspace;
    if (cached && cached.workspaceSlug === workspaceSlug && cached.workspacesVersion === workspacesVersion) {
      // dependencies didn't change. reuse cached value;
      return cached.value;
    }

    // recompute
    const workspaceDetails = Object.values(this._snap.workspaces).find((w) => w.slug === workspaceSlug) || null;

    this._cacheCurrentWorkspace = {
      workspaceSlug,
      workspacesVersion,
      value: workspaceDetails,
    };

    return workspaceDetails;
  }

  // cached computed: workspacesCreatedByCurrentUser
  private _cacheWorkspacesByUser?: {
    workspacesVersion: number;
    userId: string | number | undefined;
    value: IWorkspace[] | null;
  };

  get workspacesCreatedByCurrentUser(): IWorkspace[] | null {
    // const user = this.user.data;
    // if (!user) return null;

    // const userId = user.id;

    return null;
  }

  // computed actions
  getWorkspaceBySlug = (workspaceSlug: string): IWorkspace | null => {
    return Object.values(this._snap.workspaces).find((w) => w.slug === workspaceSlug) || null;
  };

  getWorkspaceById = (workspaceId: string): IWorkspace | null => {
    return this._snap.workspaces[workspaceId] || null;
  };

  // crud actions
  public fetchWorkspaces = async (): Promise<IWorkspace[]> => {
    this.set({ loader: true });

    try {
      const workspaceResponse = await this.workspaceService.userWorkspaces();

      const nextMap: Record<string, IWorkspace> = {};
      workspaceResponse.forEach((workspace) => {
        nextMap[workspace.id] = workspace;
      });

      this.set({
        workspaces: nextMap,
        workspacesVersion: this._snap.workspacesVersion + 1,
      });

      return workspaceResponse;
    } finally {
      this.set({ loader: false });
    }
  };

  private set(patch: Partial<TWorkspaceSnapshot>) {
    const prev = this._snap;
    const next: TWorkspaceSnapshot = { ...prev, ...patch };

    let changed = false;
    for (const key in next) {
      const k = key as keyof TWorkspaceSnapshot;
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
