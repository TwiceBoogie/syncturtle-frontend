import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { IInstanceAdmin, IInstanceInfo } from "@syncturtle/types";

export class InstanceService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async info(): Promise<IInstanceInfo> {
    return this.get("/api/v1/instances", { validateStatus: null })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async admins(): Promise<IInstanceAdmin[]> {
    return this.get("/api/v1/instances/admins")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
