import { IInstanceStore, InstanceStore } from "./instance.store";

export class CoreRootStore {
  instance: IInstanceStore;

  constructor() {
    this.instance = new InstanceStore();
  }
}
