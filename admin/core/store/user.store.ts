import { UserService } from "@/services/user.service";
import { IUser, Listener, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";
import { CoreRootStore } from "./root.store";
import { AuthService } from "@/services/auth.service";

type TUserSnapshot = {
  isLoading: boolean;
  isUserLoggedIn: boolean | undefined;
  currentUser: IUser | undefined;
};

const initialSnapshot: TUserSnapshot = {
  isLoading: false,
  isUserLoggedIn: undefined,
  currentUser: undefined,
};

export interface IUserStoreInternal {
  // required for useSyncExternalStore
  _subscribe: (cb: Listener) => Unsub;
  _getSnapshot: () => TUserSnapshot;
  _getServerSnapshot: () => TUserSnapshot;
  // observables
  isLoading: boolean;
  isUserLoggedIn: boolean | undefined;
  currentUser: IUser | undefined;
  // actions
  hydrate: (data: IUser) => void;
  fetchCurrentUser: () => Promise<IUser>;
  signOut: () => Promise<void>;
  reset: () => void;
}

export type TUserStore = Omit<IUserStoreInternal, "_subscribe" | "_getSnapshot" | "_getServerSnapshot">;

export class UserStore implements IUserStoreInternal {
  private _snap: TUserSnapshot = initialSnapshot;
  private emitter: InstanceType<typeof Emitter>;

  // external deps
  private userService: UserService;
  private authService: AuthService;

  constructor(private _rootStore: CoreRootStore) {
    this.emitter = new Emitter();

    this.userService = new UserService();
    this.authService = new AuthService();
  }

  // useSyncExternalStore integration
  /** @internal */
  public _subscribe = (cb: () => void): Unsub => this.emitter.subscribe(cb);
  /** @internal */
  public _getSnapshot = (): TUserSnapshot => this._snap;
  /** @internal */
  public _getServerSnapshot = (): TUserSnapshot => this._snap;

  // raw getters for state
  get isLoading(): boolean {
    return this._snap.isLoading;
  }

  get isUserLoggedIn(): boolean | undefined {
    return this._snap.isUserLoggedIn;
  }

  get currentUser(): IUser | undefined {
    return this._snap.currentUser;
  }

  // fetch + actions
  public hydrate = (data: IUser): void => {};

  public fetchCurrentUser = async (): Promise<IUser> => {
    try {
      if (this._snap.currentUser === undefined) {
        this.set({ isLoading: true });
      }
      const currentUser = await this.userService.currentUser();
      if (currentUser) {
        await this._rootStore.instance.fetchInstanceAdmins();
        this.set({ isLoading: false, isUserLoggedIn: true, currentUser: currentUser });
      } else {
        this.set({ isLoading: false, isUserLoggedIn: false, currentUser: undefined });
      }
      return currentUser;
    } catch (error) {
      console.log("error has occurred: ", error);
      this.set({ isLoading: false, isUserLoggedIn: false });
      throw error;
    }
  };

  public signOut = async (): Promise<void> => {
    try {
      await this.authService.signOut();
      this._rootStore.resetAfterLogout();
    } catch (error) {
      console.error("error logging out: ", error);
      throw error;
    }
  };

  public reset = () => {
    this.set({ ...initialSnapshot, isUserLoggedIn: false });
  };

  private set(patch: Partial<TUserSnapshot>) {
    const prev = this._snap;
    let next: TUserSnapshot = { ...prev, ...patch };

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
