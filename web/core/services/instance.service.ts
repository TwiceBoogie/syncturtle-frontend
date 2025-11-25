import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService, HttpError } from "./api.service";
import { IApiErrorPayload, IInstanceInfo } from "@syncturtle/types";

export class InstanceService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async getInstanceInfo(): Promise<IInstanceInfo> {
    try {
      const response = await this.get<IInstanceInfo>("/api/v1/instances");
      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }
}
