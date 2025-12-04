import { IUser, Listener, Unsub } from "@syncturtle/types";
import { CoreRootStore } from "../root.store";
import { UserService } from "@/services/user.service";
import { ProfileStore, TProfileStore } from "./profile.store";
import { Emitter } from "@syncturtle/utils";
import { TUserSettingsStore, UserSettingsStore } from "./settings.store";

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

export interface IUserStoreInternal {
  // required for useSyncExternalStore
  _subscribe: (cb: Listener) => Unsub;
  _getSnapshot: () => TUserSnapshot;
  _getServerSnapshot: () => TUserSnapshot;
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
  userProfile: TProfileStore;
  userSettings: TUserSettingsStore;
}

export type TUserStore = Omit<IUserStoreInternal, "_subscribe" | "_getSnapshot" | "_getServerSnapshot">;

export class UserStore implements IUserStoreInternal {
  private _snap: TUserSnapshot = initialSnapshot;
  private emitter: InstanceType<typeof Emitter>;

  // external deps
  private userService: UserService;

  // sub-stores
  userProfile: TProfileStore;
  userSettings: TUserSettingsStore;

  constructor(private _rootStore: CoreRootStore) {
    this.emitter = new Emitter();

    this.userService = new UserService();
    this.userProfile = new ProfileStore(_rootStore);
    this.userSettings = new UserSettingsStore();
  }

  // useSyncExternalStore integration
  /** @internal */
  public _subscribe = (cb: () => void): Unsub => this.emitter.subscribe(cb);
  /** @internal */
  public _getSnapshot = (): TUserSnapshot => this._snap;
  /** @internal */
  public _getServerSnapshot = (): TUserSnapshot => this._snap;

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
        await Promise.all([
          this.userProfile.fetchUserProfile(),
          this.userSettings.fetchCurrentUserSettings(),
          this._rootStore.workspace.fetchWorkspaces(),
        ]);
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
