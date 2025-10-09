import { IInstanceStore, InstanceStore } from "./instance.store";
import { IThemeStore, ThemeStore } from "./theme.store";
import { IUserStore, UserStore } from "./user.store";

export abstract class CoreRootStore {
  theme: IThemeStore;
  instance: IInstanceStore;
  user: IUserStore;

  constructor() {
    this.instance = new InstanceStore();
    this.theme = new ThemeStore();
    this.user = new UserStore(this);
  }

  hydrate(initialData: any) {
    this.instance.hydrate(initialData.instance);
  }
}
