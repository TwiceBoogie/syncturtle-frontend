import { UserService } from "@/services/user.service";
import { IUser, Listener, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";
import { CoreRootStore } from "./root.store";
import { AuthService } from "@/services/auth.service";

type TSnapshot = {
  isLoading: boolean;
  isUserLoggedIn: boolean | undefined;
  currentUser: IUser | undefined;
};

const initial: TSnapshot = {
  isLoading: false,
  isUserLoggedIn: undefined,
  currentUser: undefined,
};

export interface IUserStore {
  // uSES
  subscribe: (cb: Listener) => Unsub;
  getSnapshot: () => TSnapshot;
  getServerSnapshot: () => TSnapshot;
  // actions
  hydrate: (data: IUser) => void;
  fetchCurrentUser: () => Promise<IUser>;
  signOut: () => Promise<void>;
  reset: () => void;
}

export class UserStore implements IUserStore {
  // private
  private _snap: TSnapshot = initial;
  private emitter: Emitter;
  private userService: UserService;
  private authService: AuthService;

  constructor(private store: CoreRootStore) {
    this.emitter = new Emitter();
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  public subscribe = (cb: Listener): Unsub => this.emitter.subscribe(cb);

  public getSnapshot = (): TSnapshot => this._snap;

  public getServerSnapshot = (): TSnapshot => this._snap;

  public hydrate = (data: IUser): void => {};

  public fetchCurrentUser = async (): Promise<IUser> => {
    this.set({ isLoading: true });
    try {
      const currentUser = await this.userService.currentUser();

      if (currentUser) {
        await this.store.instance.fetchInstanceAdmins();
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
      this.store.resetAfterLogout();
    } catch (error) {
      console.error("error logging out: ", error);
      throw error;
    }
  };

  public reset = () => {
    this.set({ ...initial, isUserLoggedIn: false });
  };

  private set(patch: Partial<TSnapshot>) {
    this._snap = { ...this._snap, ...patch };
    this.emitter.emit();
  }
}
