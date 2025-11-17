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
type TSnapshot = {
  instance: IInstance | undefined;
  config: IInstanceConfig | undefined;
  instanceAdmins: IInstanceAdmin[] | undefined;
  instanceConfigurations: IInstanceConfiguration[] | undefined;
  formattedConfig: TFormattedInstanceConfiguration | undefined;
  isLoading: boolean;
  error: TError | undefined;
};

export interface IInstanceStore {
  subscribe(cb: () => void): Unsub;
  getSnapshot(): TSnapshot;
  getServerSnapshot(): TSnapshot;
  hydrate: (data: IInstanceInfo) => void;
  fetchInstanceInfo: () => Promise<IInstanceInfo | undefined>;
  updateInstanceInfo: (data: TInstanceUpdate) => Promise<IInstance | undefined>;
  fetchInstanceAdmins: () => Promise<IInstanceAdmin[] | undefined>;
  fetchInstanceConfigurations: () => Promise<IInstanceConfiguration[]>;
  updateInstanceConfigurations: (data: Partial<TFormattedInstanceConfiguration>) => Promise<IInstanceConfiguration[]>;
  reset: () => void;
}

const initial: TSnapshot = {
  instance: undefined,
  config: undefined,
  instanceAdmins: undefined,
  instanceConfigurations: undefined,
  formattedConfig: undefined,
  isLoading: false,
  error: undefined,
};

export class InstanceStore implements IInstanceStore {
  private _snap: TSnapshot = initial;
  private emitter: Emitter;
  private instanceService: InstanceService;

  constructor() {
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

  public subscribe = (cb: () => void): Unsub => {
    // console.log(cb);
    return this.emitter.subscribe(cb);
  };

  public getSnapshot = (): TSnapshot => this._snap;
  public getServerSnapshot = (): TSnapshot => this._snap;

  public fetchInstanceInfo = async () => {
    try {
      this.set({ isLoading: true, error: undefined });
      const instanceInfo = await this.instanceService.info();
      // console.log(instanceInfo);
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
        this.set({ instanceConfigurations: instanceConfigurations, isLoading: false });
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

      this.set({ instanceConfigurations: next });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  public reset() {
    this.set({ ...initial });
  }

  private toFormatted(configs?: IInstanceConfiguration[] | null): TFormattedInstanceConfiguration | undefined {
    if (!configs) return undefined;
    return configs.reduce((acc, c) => {
      acc[c.key] = c.value;
      return acc;
    }, {} as TFormattedInstanceConfiguration);
  }

  private set(patch: Partial<TSnapshot>) {
    const next = { ...this._snap, ...patch } as TSnapshot;

    if (patch.hasOwnProperty("instanceConfigurations")) {
      next.formattedConfig = this.toFormatted(next.instanceConfigurations);
    }

    this._snap = next;
    this.emitter.emit();
  }
}
