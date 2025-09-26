import { IInstanceStore, InstanceStore } from "./instance.store";
import { IThemeStore, ThemeStore } from "./theme.store";
import { IUserStore, UserStore } from "./user";

export class CoreRootStore {
  theme: IThemeStore;
  instance: IInstanceStore;
  user: IUserStore;

  constructor() {
    this.theme = new ThemeStore();
    this.instance = new InstanceStore();
    this.user = new UserStore(this);
  }

  hydrate(initialData: any) {
    this.instance.hydrate(initialData.instance);
  }
}
