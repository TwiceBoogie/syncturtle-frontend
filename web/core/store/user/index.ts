import { IUser, Listener, Unsub } from "@syncturtle/types";
import { CoreRootStore } from "../root.store";
import { UserService } from "@/services/user.service";
import { IProfileStore, ProfileStore } from "./profile.store";
import { Emitter } from "@syncturtle/utils";

type TUserError = {
  status: string;
  message: string;
};
export type TSnapshot = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: TUserError | undefined;
  data: IUser | undefined;
};

const initial: TSnapshot = {
  isAuthenticated: false,
  isLoading: false,
  error: undefined,
  data: undefined,
};

export interface IUserStore {
  // uSES
  subscribe: (cb: Listener) => Unsub;
  getSnapshot: () => TSnapshot;
  getServerSnapshot: () => TSnapshot;
  // stores
  userProfile: IProfileStore;
  // fucntions
  fetchCurrentUser: () => Promise<IUser | undefined>;
  //   updateCurrentUser: (data: Partial<IUser>) => Promise<IUser | undefined>;
  //   handleSetPassword: (csrfToken: string, data: { password: string }) => Promise<IUser | undefined>;
  //   deactivateAccount: () => Promise<void>;
  //   reset: () => void;
  //   signOut: () => Promise<void>;
}

export class UserStore implements IUserStore {
  // private
  private _snap: TSnapshot = initial;
  private userService: UserService;
  private emitter: Emitter;
  userProfile: IProfileStore;

  constructor(private store: CoreRootStore) {
    this.emitter = new Emitter();
    this.userService = new UserService();
    this.userProfile = new ProfileStore(store);
  }

  public subscribe = (cb: Listener): Unsub => this.emitter.subscribe(cb);
  public getSnapshot = (): TSnapshot => this._snap;
  public getServerSnapshot = (): TSnapshot => this._snap;
  public fetchCurrentUser = async (): Promise<IUser | undefined> => {
    this.set({ isLoading: true, error: undefined });
    try {
      const user = await this.userService.currentUser();
      this.set({ data: user, isLoading: false, error: undefined });

      if (user && user.id) {
        await Promise.all([this.userProfile.fetchUserProfile()]);
      }
      return user;
    } catch (error) {
      this.set({
        isLoading: false,
        error: {
          status: "user-fetch-error",
          message: "Failed to fetch current user",
        },
      });
      throw error;
    }
  };

  private set(patch: Partial<TSnapshot>) {
    this._snap = { ...this._snap, ...patch };
    this.emitter.emit();
  }
}
