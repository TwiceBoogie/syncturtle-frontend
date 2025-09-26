import { UserService } from "@/services/user.service";
import { Listener, TUserProfile, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";
import { CoreRootStore } from "../root.store";

type TProfileError = {
  status: string;
  message: string;
};

export type TSnapshot = {
  isLoading: boolean;
  error: TProfileError | undefined;
  data: TUserProfile;
};

const initial: TSnapshot = {
  isLoading: false,
  error: undefined,
  data: {
    id: undefined,
    user: undefined,
    role: undefined,
    lastWorkspaceId: undefined,
    onboardingStep: {
      profileComplete: false,
      workspaceCreate: false,
      workspaceInvite: false,
      workspaceJoin: false,
    },
    isOnboarded: false,
    billingAddressCountry: undefined,
    billingAddress: undefined,
    hasBillingAddress: false,
    createdAt: "",
    updatedAt: "",
  },
};

export interface IProfileStore {
  // uSES
  subscribe: (cb: Listener) => Unsub;
  getSnapshot: () => TSnapshot;
  getServerSnapshot: () => TSnapshot;
  fetchUserProfile: () => Promise<TUserProfile | undefined>;
  //   updateUserProfile: (data: Partial<TUserProfile>) => Promise<TUserProfile | undefined>;
  //   finishUserOnboarding: () => Promise<void>;
  //   updateTourCompleted: () => Promise<TUserProfile | undefined>;
  //   updateUserTheme: (data: Partial<IUserTheme>) => Promise<TUserProfile | undefined>;
}

export class ProfileStore implements IProfileStore {
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

  public fetchUserProfile = (): Promise<TUserProfile | undefined> => {
    this.set({ isLoading: true, error: undefined });
    try {
      const userProfile = this.userService.getCurrentUserProfile();
      this.set({ isLoading: false, error: undefined });
      return userProfile;
    } catch (error) {
      this.set({
        isLoading: false,
        error: {
          status: "user-profile-fetch-error",
          message: "Failed to fetch user profile",
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
