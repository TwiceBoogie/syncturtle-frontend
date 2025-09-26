import { CoreRootStore } from "@/store/root.store";

export class RootStore extends CoreRootStore {
  constructor() {
    super();
  }

  hydrate(initialData: any) {
    super.hydrate(initialData);
  }
}
