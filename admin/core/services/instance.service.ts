import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { IInstanceInfo } from "@syncturtle/types";

export class InstanceService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async info(): Promise<IInstanceInfo> {
    return this.get("/ui/v1/instance", { validateStatus: null })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
