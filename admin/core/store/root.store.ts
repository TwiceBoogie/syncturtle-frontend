import { IInstanceStore, InstanceStore } from "./instance.store";
import { IThemeStore, ThemeStore } from "./theme.store";
import { IUserStore, UserStore } from "./user.store";
import { IWorkspaceStore, WorkspaceStore } from "./workspace.store";

export abstract class CoreRootStore {
  theme: IThemeStore;
  instance: IInstanceStore;
  user: IUserStore;
  workspace: IWorkspaceStore;

  constructor() {
    this.instance = new InstanceStore();
    this.theme = new ThemeStore();
    this.user = new UserStore(this);
    this.workspace = new WorkspaceStore();
  }

  hydrate(initialData: any) {
    this.instance.hydrate(initialData.instance);
    this.workspace.hydrate(initialData.workspace);
  }

  resetAfterLogout() {
    this.user.reset();
    this.instance.reset();
    this.workspace.reset();
  }

  // won't work because the RootStore instance in context did not change
  // uSES still would be using the old subscribe function
  // reset() {
  //   this.instance = new InstanceStore();
  //   // etc...
  // }
}
