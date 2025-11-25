import { InstanceService } from "@/services/instance.service";
import { IInstance, IInstanceConfig, Unsub, IInstanceInfo } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";

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
  instance: IInstance | undefined;
  config: IInstanceConfig | undefined;
  error: TError | undefined;
};

// initial state used st first render and during SSR
const initialSnapshot: TInstanceSnapshot = {
  isLoading: false,
  instance: undefined,
  config: undefined,
  error: undefined,
};

// public api contract the store exposes
export interface IInstanceStore {
  // required for useSyncExternalStore
  subscribe(cb: () => void): Unsub; // tells react how to listen for changes
  getSnapshot(): TInstanceSnapshot; // current store state snapshot
  getServerSnapshot(): TInstanceSnapshot;

  // observable
  isLoading: boolean;
  instance: IInstance | undefined;
  config: IInstanceConfig | undefined;
  error: TError | undefined;
  // actions; store methods that change state
  fetchInstanceInfo: () => Promise<void>;
  hydrate: (data: IInstanceInfo) => void;
}

export class InstanceStore implements IInstanceStore {
  private _snap: TInstanceSnapshot = initialSnapshot;
  private emitter: InstanceType<typeof Emitter>;

  // external deps
  private instanceService: InstanceService;
  // sub-stores

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

  // useSyncExternalStore integration
  // use arrow func so 'this' stays bound to instance
  // register listener, react will pass a callback here and call the
  // return func on onmount to unsubscribe
  public subscribe = (cb: () => void): Unsub => this.emitter.subscribe(cb);
  public getSnapshot = (): TInstanceSnapshot => this._snap;
  public getServerSnapshot = (): TInstanceSnapshot => this._snap;

  // raw getters for state
  get isLoading(): boolean {
    return this._snap.isLoading;
  }

  get instance(): IInstance | undefined {
    return this._snap.instance;
  }

  get config(): IInstanceConfig | undefined {
    return this._snap.config;
  }

  get error(): TError | undefined {
    return this._snap.error;
  }

  // crud actions
  public fetchInstanceInfo = async (): Promise<void> => {
    this.set({ isLoading: true, error: undefined });

    try {
      const instanceInfo = await this.instanceService.getInstanceInfo();
      console.log(instanceInfo);
      this.set({
        isLoading: false,
        instance: instanceInfo.instance,
        config: instanceInfo.config,
      });
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

  private set(patch: Partial<TInstanceSnapshot>) {
    const prev = this._snap;
    const next = { ...prev, ...patch };

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
