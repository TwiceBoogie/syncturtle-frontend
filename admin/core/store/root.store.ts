import { IInstanceStore, InstanceStore } from "./instance.store";
import { IThemeStore, ThemeStore } from "./theme.store";

export abstract class CoreRootStore {
  theme: IThemeStore;
  instance: IInstanceStore;

  constructor() {
    this.instance = new InstanceStore();
    this.theme = new ThemeStore();
  }

  hydrate(initialData: any) {
    this.instance.hydrate(initialData.instance);
  }
}
