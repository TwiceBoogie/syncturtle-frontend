import { InstanceService } from "@/services/instance.service";
import {
  IInstance,
  IInstanceConfig,
  IInstanceAdmin,
  IInstanceConfiguration,
  TFormattedInstanceConfiguration,
  Unsub,
  IInstanceInfo,
  TInstanceUpdate,
} from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";
import { CoreRootStore } from "./root.store";

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const DEBUG_MIN_DELAY_MS = Number(process.env.NEXT_PUBLIC_DEBUG_DELAY_MS ?? 0);

type TError = {
  status: string;
  message: string;
  data?: {
    isActivated: boolean;
    isSetupDone: boolean;
  };
};

// immutable snapshot of the store state; react components will read
type TInstanceSnapshot = {
  isLoading: boolean;
  error: TError | undefined;
  instance: IInstance | undefined;
  config: IInstanceConfig | undefined;
  instanceAdmins: IInstanceAdmin[] | undefined;
  instanceConfigurations: IInstanceConfiguration[] | undefined;
  instanceConfigurationsVersion: number;
};

const initialSnapshot: TInstanceSnapshot = {
  isLoading: false,
  error: undefined,
  instance: undefined,
  config: undefined,
  instanceAdmins: undefined,
  instanceConfigurations: undefined,
  instanceConfigurationsVersion: 0,
};

export interface IInstanceStoreInternal {
  // required for useSyncExternalStore
  _subscribe(cb: () => void): Unsub;
  _getSnapshot(): TInstanceSnapshot;
  _getServerSnapshot(): TInstanceSnapshot;
  // observables
  isLoading: boolean;
  error: TError | undefined;
  instance: IInstance | undefined;
  config: IInstanceConfig | undefined;
  instanceAdmins: IInstanceAdmin[] | undefined;
  instanceConfigurations: IInstanceConfiguration[] | undefined;
  // computed
  formattedConfig: TFormattedInstanceConfiguration | undefined;
  // fetch + actions
  hydrate: (data: IInstanceInfo) => void;
  fetchInstanceInfo: () => Promise<IInstanceInfo | undefined>;
  updateInstanceInfo: (data: TInstanceUpdate) => Promise<IInstance | undefined>;
  fetchInstanceAdmins: () => Promise<IInstanceAdmin[] | undefined>;
  fetchInstanceConfigurations: () => Promise<IInstanceConfiguration[]>;
  updateInstanceConfigurations: (data: Partial<TFormattedInstanceConfiguration>) => Promise<IInstanceConfiguration[]>;
  // disableEmail: () => Promise<void>;
  reset: () => void;
}

export type TInstanceStore = Omit<IInstanceStoreInternal, "_subscribe" | "_getSnapshot" | "_getServerSnapshot">;

export class InstanceStore implements IInstanceStoreInternal {
  private _snap: TInstanceSnapshot = initialSnapshot;
  private emitter: InstanceType<typeof Emitter>;

  // external deps
  private instanceService: InstanceService;

  constructor(private _rootStore: CoreRootStore) {
    this.emitter = new Emitter();

    this.instanceService = new InstanceService();
  }

  public hydrate(data: IInstanceInfo | TError) {
    if (data) {
      if ("instance" in data && "config" in data) {
        this.set({ instance: data.instance, config: data.config });
      } else if ("status" in data && "message" in data) {
        this.set({ error: data });
      }
    }
  }

  // useSyncExternalStore integration
  /** @internal */
  public _subscribe = (cb: () => void): Unsub => this.emitter.subscribe(cb);
  /** @internal */
  public _getSnapshot = (): TInstanceSnapshot => this._snap;
  /** @internal */
  public _getServerSnapshot = (): TInstanceSnapshot => this._snap;

  // raw getters for state
  get isLoading(): boolean {
    return this._snap.isLoading;
  }

  get error(): TError | undefined {
    return this._snap.error;
  }

  get instance(): IInstance | undefined {
    return this._snap.instance;
  }

  get config(): IInstanceConfig | undefined {
    return this._snap.config;
  }

  get instanceAdmins(): IInstanceAdmin[] | undefined {
    return this._snap.instanceAdmins;
  }

  get instanceConfigurations(): IInstanceConfiguration[] | undefined {
    return this._snap.instanceConfigurations;
  }

  // cached compute: formattedConfig
  private _cacheFormattedConfig?: {
    instanceConfigurationsVersion: number;
    value: TFormattedInstanceConfiguration | undefined;
  };

  get formattedConfig(): TFormattedInstanceConfiguration | undefined {
    const { instanceConfigurationsVersion, instanceConfigurations } = this._snap;

    if (!instanceConfigurations) return;

    const cached = this._cacheFormattedConfig;
    if (cached && cached.instanceConfigurationsVersion === instanceConfigurationsVersion) {
      return cached.value;
    }

    // recompute
    const formatted = instanceConfigurations.reduce((formData: TFormattedInstanceConfiguration, config) => {
      formData[config.key] = config.value;
      return formData;
    }, {} as TFormattedInstanceConfiguration);

    this._cacheFormattedConfig = {
      instanceConfigurationsVersion,
      value: formatted,
    };

    return formatted;
  }

  public fetchInstanceInfo = async () => {
    const { instance } = this._snap;
    try {
      if (instance === undefined) {
        this.set({ isLoading: true });
      }
      this.set({ error: undefined });

      const instanceInfo = await this.instanceService.info();

      if (instance === undefined && !instanceInfo.instance.workspacesExist) {
        this._rootStore.theme.toggleNewUserPopup();
      }

      this.set({
        instance: instanceInfo.instance,
        config: instanceInfo.config,
        isLoading: false,
      });

      return instanceInfo;
    } catch (error) {
      this.set({
        isLoading: false,
        error: {
          status: "error",
          message: "Failed to fetch isntance info",
        },
      });
      throw error;
    }
  };

  public updateInstanceInfo = async (data: TInstanceUpdate) => {
    try {
      const instanceResponse = await this.instanceService.update(data);
      if (instanceResponse) {
        this.set({ instance: instanceResponse });
      }
      return instanceResponse;
    } catch (error) {
      console.error("Error updating instance info");
      throw error;
    }
  };

  public fetchInstanceAdmins = async (): Promise<IInstanceAdmin[]> => {
    try {
      const instanceAdmins = await this.instanceService.admins();

      if (instanceAdmins) {
        this.set({ instanceAdmins: instanceAdmins });
      }
      return instanceAdmins;
    } catch (error) {
      throw error;
    }
  };

  public fetchInstanceConfigurations = async (): Promise<IInstanceConfiguration[]> => {
    try {
      const instanceConfigurations = await this.instanceService.configurations();
      if (instanceConfigurations) {
        this.set({
          instanceConfigurations: instanceConfigurations,
        });
      }
      return instanceConfigurations;
    } catch (error) {
      console.error("Error fetching instance configurations");
      throw error;
    }
  };

  public updateInstanceConfigurations = async (data: Partial<TFormattedInstanceConfiguration>) => {
    try {
      const res = await this.instanceService.updateConfigurations(data);

      const current = this._snap.instanceConfigurations ?? [];
      const byKey = new Map(res.map((r) => [r.key, r]));

      const next = current.map((cfg) => byKey.get(cfg.key) ?? cfg);

      this.set({
        instanceConfigurations: next,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  public reset() {
    this.set({ ...initialSnapshot });
  }

  private set(patch: Partial<TInstanceSnapshot>) {
    const prev = this._snap;
    let next: TInstanceSnapshot = { ...prev, ...patch };

    // if instanceConfiguration changed, bump version & clear cache
    if (
      Object.prototype.hasOwnProperty.call(patch, "instanceConfigurations") &&
      !Object.is(prev.instanceConfigurations, next.instanceConfigurations)
    ) {
      next = {
        ...next,
        instanceConfigurationsVersion: prev.instanceConfigurationsVersion + 1,
      };
      this._cacheFormattedConfig = undefined;
    }

    let changed = false;
    for (const key in next) {
      const k = key as keyof TInstanceSnapshot;
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
