import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { IInstanceInfo } from "@syncturtle/types";

export class InstanceService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async requestCSRFToken(): Promise<{ csrf_token: string }> {
    return this.get("/auth/get-csrf-token/")
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  async getInstanceInfo(): Promise<IInstanceInfo> {
    return this.get("/ui/v1/instance")
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }
}
