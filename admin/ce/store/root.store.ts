import { CoreRootStore } from "@/store/root.store";

export class RootStore extends CoreRootStore {
  constructor() {
    super();
  }

  hydrate(intitialData: any) {
    super.hydrate(intitialData);
  }
}
