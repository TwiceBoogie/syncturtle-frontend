import { UserService } from "@/services/user.service";
import { IUser, Listener, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";
import { CoreRootStore } from "./root.store";

type TSnapshot = {
  isLoading: boolean;
  isUserLoggedIn: boolean;
  currentUser: IUser | undefined;
};

const initial: TSnapshot = {
  isLoading: false,
  isUserLoggedIn: false,
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
}

export class UserStore implements IUserStore {
  // private
  private _snap: TSnapshot = initial;
  private emitter: Emitter;
  private userService: UserService;

  constructor(private store: CoreRootStore) {
    this.emitter = new Emitter();
    this.userService = new UserService();
  }

  public subscribe = (cb: Listener): Unsub => this.emitter.subscribe(cb);
  public getSnapshot = (): TSnapshot => this._snap;
  public getServerSnapshot = (): TSnapshot => this._snap;
  public hydrate = (data: IUser): void => {};
  public fetchCurrentUser = async (): Promise<IUser> => {
    this.set({ isLoading: true, isUserLoggedIn: false });
    try {
      const currentUser = await this.userService.currentUser();
      console.log(`CurrentUser ${currentUser}`);
      if (currentUser) {
        await this.store.instance.fetchInstanceAdmins();
      }
      this.set({ isLoading: false, isUserLoggedIn: true, currentUser: currentUser });
      return currentUser;
    } catch (error) {
      console.log("error has occurred: ", error);
      this.set({ isLoading: false, isUserLoggedIn: false });
      throw error;
    }
  };
  private set(patch: Partial<TSnapshot>) {
    this._snap = { ...this._snap, ...patch };
    this.emitter.emit();
  }
}
