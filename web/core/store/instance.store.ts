import { InstanceService } from "@/services/instance.service";
import { IInstance, IInstanceConfig, Unsub } from "@syncturtle/types";
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
type TSnapshot = {
  instance: IInstance | undefined;
  config: IInstanceConfig | undefined;
  isLoading: boolean;
  error: TError | undefined;
};

// public api contract the store exposes
export interface IInstanceStore {
  // required for useSyncExternalStore
  subscribe(cb: () => void): Unsub; // tells react how to listen for changes
  getSnapshot(): TSnapshot; // current store state snapshot
  getServerSnapshot(): TSnapshot;

  // actions; store methods that change state
  fetchInstanceInfo: () => Promise<void>;
}

// initial state used st first render and during SSR
const initial: TSnapshot = {
  instance: undefined,
  config: undefined,
  isLoading: false,
  error: undefined,
};

export class InstanceStore implements IInstanceStore {
  // PRIVATE INTERNALS
  private _snap: TSnapshot = initial;
  // if a fetch ongoing, keep promise to dedupe concurrent calls
  private inflight: Promise<void> | null = null;
  // pub/sub helper to notify react and other subscribers on changes
  private emitter: Emitter;
  // service
  private instanceService: InstanceService;

  constructor() {
    this.emitter = new Emitter();
    this.instanceService = new InstanceService();
  }

  // use arrow func so 'this' stays bound to instance
  // register listener, react will pass a callback here and call the
  // return func on onmount to unsubscribe
  public subscribe = (cb: () => void): Unsub => {
    console.log(cb);
    return this.emitter.subscribe(cb);
  };
  // return current state snapshot (read during render)
  public getSnapshot = (): TSnapshot => this._snap;
  // return server-render snapshot; stable and serializble
  public getServerSnapshot = (): TSnapshot => initial;

  public fetchInstanceInfo = (): Promise<void> => {
    // if request already in flight, return the same promise to dedupe
    if (this.inflight) return this.inflight;

    // flip loading on and clear previous errors
    this.set({ isLoading: true, error: undefined });

    // create and store the inflight promise so callers can await it
    this.inflight = (async () => {
      try {
        const instanceInfo = await this.instanceService.getInstanceInfo();
        this.set({
          instance: instanceInfo.instance,
          config: instanceInfo.config,
          isLoading: false,
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
