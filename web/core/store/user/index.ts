import { IUser, Listener, Unsub } from "@syncturtle/types";
import { CoreRootStore } from "../root.store";
import { UserService } from "@/services/user.service";
import { IProfileStore, ProfileStore } from "./profile.store";
import { Emitter } from "@syncturtle/utils";

type TUserError = {
  status: string;
  message: string;
};
export type TUserSnapshot = {
  // raw state
  isAuthenticated: boolean;
  isLoading: boolean;
  error: TUserError | undefined;
  data: IUser | undefined;
  // computed + cache
  // localDBEnabled: boolean;
  // canPerformAnyCreateAction: boolean;
  // projectsWithCreatePermission: {[projectId: string]: number} | null;

  // localDBEnabledVersion: number;
  // canPerformAnyCreateActionVersion: number;
};

const initialSnapshot: TUserSnapshot = {
  isAuthenticated: false,
  isLoading: false,
  error: undefined,
  data: undefined,
};

export interface IUserStore {
  // required for useSyncExternalStore
  subscribe: (cb: Listener) => Unsub;
  getSnapshot: () => TUserSnapshot;
  getServerSnapshot: () => TUserSnapshot;
  // observables
  isAuthenticated: boolean;
  isLoading: boolean;
  error: TUserError | undefined;
  data: IUser | undefined;
  // actions
  fetchCurrentUser: () => Promise<IUser | undefined>;
  //   updateCurrentUser: (data: Partial<IUser>) => Promise<IUser | undefined>;
  //   handleSetPassword: (csrfToken: string, data: { password: string }) => Promise<IUser | undefined>;
  //   deactivateAccount: () => Promise<void>;
  //   reset: () => void;
  //   signOut: () => Promise<void>;
  // sub-stores
  userProfile: IProfileStore;
}

export class UserStore implements IUserStore {
  private _snap: TUserSnapshot = initialSnapshot;
  private emitter: InstanceType<typeof Emitter>;

  // external deps
  private userService: UserService;

  // sub-stores
  userProfile: IProfileStore;

  constructor(private _rootStore: CoreRootStore) {
    this.emitter = new Emitter();

    this.userService = new UserService();
    this.userProfile = new ProfileStore(_rootStore);
  }

  // useSyncExternalStore integration
  public subscribe = (cb: Listener): Unsub => this.emitter.subscribe(cb);
  public getSnapshot = (): TUserSnapshot => this._snap;
  public getServerSnapshot = (): TUserSnapshot => this._snap;

  // raw getters for state
  get isAuthenticated(): boolean {
    return this._snap.isAuthenticated;
  }

  get isLoading(): boolean {
    return this._snap.isLoading;
  }

  get error(): TUserError | undefined {
    return this._snap.error;
  }

  get data(): IUser | undefined {
    return this._snap.data;
  }

  // crud actions
  public fetchCurrentUser = async (): Promise<IUser> => {
    this.set({ isLoading: true, error: undefined });
    try {
      const user = await this.userService.currentUser();

      if (user && user.id) {
        await Promise.all([this.userProfile.fetchUserProfile(), this._rootStore.workspace.fetchWorkspaces()]);
        this.set({ data: user, isLoading: false, error: undefined });
      } else {
        this.set({ data: user, isLoading: false, isAuthenticated: false });
      }
      return user;
    } catch (error) {
      this.set({
        isLoading: false,
        isAuthenticated: false,
        error: {
          status: "user-fetch-error",
          message: "Failed to fetch current user",
        },
      });
      throw error;
    }
  };

  private set(patch: Partial<TUserSnapshot>) {
    const prev = this._snap;
    const next = { ...prev, ...patch };

    let changed = false;
    for (const key in next) {
      const k = key as keyof TUserSnapshot;
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
