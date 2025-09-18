import { Listener, Unsub } from "@syncturtle/types";

export class Emitter {
  private listeners = new Set<Listener>();

  /**
   * registers a listener and returns a callback to unsubscribe
   * @param listener function to call when something changes
   */
  subscribe = (listener: Listener): Unsub => {
    // we add listeners to collection
    this.listeners.add(listener);
    // return an 'unsubscribe' function that removes the listener
    return () => this.listeners.delete(listener);
  };

  // notify all listeners and iterate over the current set and call each one
  emit = (): void => this.listeners.forEach((listener) => listener());
}
