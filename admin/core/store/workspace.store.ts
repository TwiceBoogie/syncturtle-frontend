import { WorkspaceService } from "@/services/workspace.service";
import { IWorkspace, Listener, TPaginationInfo, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";

type TLoader = "init-loader" | "mutation" | "pagination" | "loaded" | undefined;

type TSnapshot = {
  loader: TLoader;
  workspaces: Record<string, IWorkspace>;
  // computed as side effect
  workspaceIds: string[];
  paginationInfo: TPaginationInfo | undefined;
};

const initial: TSnapshot = {
  loader: "init-loader",
  workspaces: {},
  workspaceIds: [],
  paginationInfo: undefined,
};

export interface IWorkspaceStore {
  // for uSES
  subscribe: (cb: Listener) => Unsub;
  getSnapshot: () => TSnapshot;
  getServerSnapshot: () => TSnapshot;
  // actions
  hydrate: (data: Record<string, IWorkspace>) => void;
  getWorkspaceById: (workspaceId: string) => IWorkspace | undefined;
  fetchWorkspaces: () => Promise<IWorkspace[]>;
  fetchNextWorkspaces: () => Promise<IWorkspace[]>;
  //   createWorkspace: (data: IWorkspace, csrfToken: string) => Promise<IWorkspace>;
}

export class WorkspaceStore implements IWorkspaceStore {
  private _snap: TSnapshot = initial;
  private emitter: Emitter;
  private workspaceService: WorkspaceService;

  constructor() {
    this.emitter = new Emitter();
    this.workspaceService = new WorkspaceService();
  }

  public hydrate = (data: Record<string, IWorkspace>): void => {
    if (!data) return;
    this.set({ workspaces: { ...data } });
  };

  public subscribe = (cb: Listener): Unsub => this.emitter.subscribe(cb);
  public getSnapshot = (): TSnapshot => this._snap;
  public getServerSnapshot = (): TSnapshot => this._snap;

  public getWorkspaceById = (workspaceId: string): IWorkspace | undefined => this._snap.workspaces[workspaceId];

  public fetchWorkspaces = async (): Promise<IWorkspace[]> => {
    try {
      if (this._snap.workspaceIds.length > 0) {
        this.set({ loader: "mutation" });
      } else {
        this.set({ loader: "init-loader" });
      }
      const paginationData = await this.workspaceService.list();
      const { results, ...paginationInfo } = paginationData;

      const nextMap: Record<string, IWorkspace> = {};
      for (const ws of results) {
        nextMap[ws.id] = ws;
      }

      this.set({
        workspaces: nextMap,
        paginationInfo: paginationInfo,
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
    const page = this._snap.paginationInfo;
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

  private set(patch: Partial<TSnapshot>) {
    const next: TSnapshot = { ...this._snap, ...patch };

    if (patch.hasOwnProperty("workspaces")) {
      next.workspaceIds = Object.keys(next.workspaces);
    }

    this._snap = next;
    this.emitter.emit();
  }
}
