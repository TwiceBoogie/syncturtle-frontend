import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import {
  IInstance,
  IInstanceAdmin,
  IInstanceConfiguration,
  IInstanceInfo,
  TFormattedInstanceConfiguration,
  TInstanceUpdate,
} from "@syncturtle/types";

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

  async update(data: TInstanceUpdate, csrfToken: string): Promise<IInstance> {
    return this.patch("/api/v1/instances", data, { headers: { "X-CSRF-TOKEN": csrfToken } })
      .then((response) => response?.data)
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

  async configurations(): Promise<IInstanceConfiguration[]> {
    return this.get("/api/v1/instances/configurations")
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateConfigurations(
    data: Partial<TFormattedInstanceConfiguration>,
    csrfToken: string
  ): Promise<IInstanceConfiguration[]> {
    return this.patch("/api/v1/instances/configurations", data, { headers: { "X-CSRF-TOKEN": csrfToken } })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
