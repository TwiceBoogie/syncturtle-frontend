import { IInstanceStore, InstanceStore } from "./instance.store";
import { IRouterStore, RouterStore } from "./router.store";
import { IThemeStore, ThemeStore } from "./theme.store";
import { IUserStore, UserStore } from "./user";
import { IWorkspaceStore, WorkspaceStore } from "./workspace";

export class CoreRootStore {
  router: IRouterStore;
  theme: IThemeStore;
  instance: IInstanceStore;
  user: IUserStore;
  workspace: IWorkspaceStore;

  constructor() {
    this.router = new RouterStore();
    this.theme = new ThemeStore();
    this.instance = new InstanceStore();
    this.user = new UserStore(this);
    this.workspace = new WorkspaceStore(this);
  }

  hydrate(initialData: any) {
    this.instance.hydrate(initialData.instance);
  }
}
