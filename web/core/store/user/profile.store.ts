import { UserService } from "@/services/user.service";
import { Listener, TUserProfile, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";
import { CoreRootStore } from "../root.store";

type TProfileError = {
  status: string;
  message: string;
};

export type TUserProfileSnapshot = {
  isLoading: boolean;
  error: TProfileError | undefined;
  data: TUserProfile;
};

const initialSnapshot: TUserProfileSnapshot = {
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

export interface IProfileStoreInternal {
  // required for useSyncExternalStore
  _subscribe: (cb: Listener) => Unsub;
  _getSnapshot: () => TUserProfileSnapshot;
  _getServerSnapshot: () => TUserProfileSnapshot;
  // observables
  isLoading: boolean;
  error: TProfileError | undefined;
  data: TUserProfile;
  // fetch + actions
  fetchUserProfile: () => Promise<TUserProfile | undefined>;
  //   updateUserProfile: (data: Partial<TUserProfile>) => Promise<TUserProfile | undefined>;
  //   finishUserOnboarding: () => Promise<void>;
  //   updateTourCompleted: () => Promise<TUserProfile | undefined>;
  //   updateUserTheme: (data: Partial<IUserTheme>) => Promise<TUserProfile | undefined>;
}

export type TProfileStore = Omit<IProfileStoreInternal, "_subscribe" | "_getSnapshot" | "_getServerSnapshot">;

export class ProfileStore implements IProfileStoreInternal {
  private _snap: TUserProfileSnapshot = initialSnapshot;
  private emitter: InstanceType<typeof Emitter>;

  // external deps
  private userService: UserService;

  constructor(private _rootStore: CoreRootStore) {
    this.emitter = new Emitter();

    this.userService = new UserService();
  }

  // useSyncExternalStore integration
  /** @internal */
  public _subscribe = (cb: () => void): Unsub => this.emitter.subscribe(cb);
  /** @internal */
  public _getSnapshot = (): TUserProfileSnapshot => this._snap;
  /** @internal */
  public _getServerSnapshot = (): TUserProfileSnapshot => this._snap;

  // raw getters for state
  get isLoading(): boolean {
    return this._snap.isLoading;
  }

  get error(): TProfileError | undefined {
    return this._snap.error;
  }

  get data(): TUserProfile {
    return this._snap.data;
  }

  // fetch + actions
  public fetchUserProfile = async (): Promise<TUserProfile | undefined> => {
    this.set({ isLoading: true, error: undefined });

    try {
      const userProfile = await this.userService.getCurrentUserProfile();
      this.set({ isLoading: false, data: userProfile });

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

  private set(patch: Partial<TUserProfileSnapshot>) {
    const prev = this._snap;
    const next = { ...prev, ...patch };

    let changed = false;
    for (const key in next) {
      const k = key as keyof TUserProfileSnapshot;
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
