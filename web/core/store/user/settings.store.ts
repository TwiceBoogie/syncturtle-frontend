import { UserService } from "@/services/user.service";
import { IUserSettings, Listener, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";

type TError = {
  status: string;
  message: string;
};

interface IUserSettingsSnapshot {
  isLoading: boolean;
  error: TError | undefined;
  data: IUserSettings;
}

const initialSnapshot: IUserSettingsSnapshot = {
  isLoading: false,
  error: undefined,
  data: {
    id: undefined,
    email: undefined,
    workspace: {
      lastWorkspaceId: undefined,
      lastWorkspaceSlug: undefined,
      lastWorkspaceName: undefined,
      lastWorkspaceLogo: undefined,
      fallbackWorkspaceId: undefined,
      fallbackWorkspaceSlug: undefined,
      invites: undefined,
    },
  },
};

export interface IUserSettingsStoreInternal {
  // required for useSyncExternalStore
  _subscribe: (cb: Listener) => Unsub;
  _getSnapshot: () => IUserSettingsSnapshot;
  _getServerSnapshot: () => IUserSettingsSnapshot;
  // observables
  isLoading: boolean;
  error: TError | undefined;
  data: IUserSettings;
  // actions
  fetchCurrentUserSettings: () => Promise<IUserSettings | undefined>;
}

export type TUserSettingsStore = Omit<IUserSettingsStoreInternal, "_subscribe" | "_getSnapshot" | "_getServerSnapshot">;

export class UserSettingsStore implements IUserSettingsStoreInternal {
  private _snap: IUserSettingsSnapshot = initialSnapshot;
  private emitter: InstanceType<typeof Emitter>;

  // external deps
  private userService: UserService;

  constructor() {
    this.emitter = new Emitter();

    this.userService = new UserService();
  }

  // useSyncExternalStore integration
  /** @internal */
  public _subscribe = (cb: () => void): Unsub => this.emitter.subscribe(cb);
  /** @internal */
  public _getSnapshot = (): IUserSettingsSnapshot => this._snap;
  /** @internal */
  public _getServerSnapshot = (): IUserSettingsSnapshot => this._snap;

  // raw getters for state
  get isLoading(): boolean {
    return this._snap.isLoading;
  }

  get error(): TError | undefined {
    return this._snap.error;
  }

  get data(): IUserSettings {
    return this._snap.data;
  }

  // actions
  public fetchCurrentUserSettings = async (): Promise<IUserSettings | undefined> => {
    this.set({ isLoading: true, error: undefined });
    try {
      const userSettings = await this.userService.currentUserSettings();
      this.set({ isLoading: false, data: userSettings });
      return userSettings;
    } catch (error) {
      this.set({
        isLoading: false,
        error: {
          status: "error",
          message: "Failed to fetch user settings",
        },
      });
      throw error;
    }
  };

  private set(patch: Partial<IUserSettingsSnapshot>) {
    const prev = this._snap;
    const next: IUserSettingsSnapshot = { ...prev, ...patch };

    let changed = false;
    for (const key in next) {
      const k = key as keyof IUserSettingsSnapshot;
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
