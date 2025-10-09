import { InstanceService } from "@/services/instance.service";
import { IInstance, IInstanceConfig, Unsub, IInstanceInfo, IInstanceAdmin } from "@syncturtle/types";
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
  isLoading: boolean;
  error: TError | undefined;
};

export interface IInstanceStore {
  subscribe(cb: () => void): Unsub;
  getSnapshot(): TSnapshot;
  getServerSnapshot(): TSnapshot;
  hydrate: (data: IInstanceInfo) => void;
  fetchInstanceInfo: () => Promise<IInstanceInfo | undefined>;
  fetchInstanceAdmins: () => Promise<IInstanceAdmin[] | undefined>;
}

const initial: TSnapshot = {
  instance: undefined,
  config: undefined,
  instanceAdmins: undefined,
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

  private set(patch: Partial<TSnapshot>) {
    this._snap = { ...this._snap, ...patch };
    this.emitter.emit();
  }
}
