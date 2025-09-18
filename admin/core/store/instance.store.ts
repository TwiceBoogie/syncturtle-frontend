import { InstanceService } from "@/services/instance.service";
import { IInstance, IInstanceConfig, IInstanceInfo, Unsub } from "@syncturtle/types";
import { Emitter } from "@syncturtle/utils";

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const DEBUG_MIN_DELAY_MS = Number(process.env.NEXT_PUBLIC_DEBUG_DELAY_MS ?? 0);
console.log(DEBUG_MIN_DELAY_MS);
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
  isLoading: boolean;
  error: TError | undefined;
};

export interface IInstanceStore {
  subscribe(cb: () => void): Unsub;
  getSnapshot(): TSnapshot;
  getServerSnapshot(): TSnapshot;
  fetchInstanceInfo: () => Promise<IInstanceInfo>;
}

const initial: TSnapshot = {
  instance: undefined,
  config: undefined,
  isLoading: false,
  error: undefined,
};

export class InstanceStore implements IInstanceStore {
  private _snap: TSnapshot = initial;
  private inflight: Promise<IInstanceInfo> | null = null;
  private emitter: Emitter;
  private instanceService: InstanceService;

  constructor() {
    this.emitter = new Emitter();
    this.instanceService = new InstanceService();
  }

  public subscribe = (cb: () => void): Unsub => {
    console.log(cb);
    return this.emitter.subscribe(cb);
  };

  public getSnapshot = (): TSnapshot => this._snap;
  public getServerSnapshot = (): TSnapshot => initial;

  public fetchInstanceInfo = () => {
    // if request already in flight, return the same promise to dedupe
    if (this.inflight) return this.inflight;

    // flip loading on and clear previous errors
    this.set({ isLoading: true, error: undefined });

    // create and store the inflight promise so callers can await it
    this.inflight = (async () => {
      try {
        // make it take at least DEBUG_MIN_DELAY_MS (even if API is fast)
        // const [instanceInfo] = await Promise.all([
        //   this.instanceService.info(),
        //   DEBUG_MIN_DELAY_MS > 0 ? sleep(DEBUG_MIN_DELAY_MS) : Promise.resolve(),
        // ]);
        const instanceInfo = await this.instanceService.info();
        console.log(instanceInfo);
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
      } finally {
        // allow future requests again
        this.inflight = null;
      }
    })();

    return this.inflight;
  };

  private set(patch: Partial<TSnapshot>) {
    this._snap = { ...this._snap, ...patch };
    this.emitter.emit();
  }
}
