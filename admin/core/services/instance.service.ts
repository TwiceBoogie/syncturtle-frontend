import { API_BASE_URL } from "@/helpers/common.helper";
import {
  IInstanceInfo,
  IApiErrorPayload,
  TInstanceUpdate,
  IInstance,
  IInstanceAdmin,
  IInstanceConfiguration,
  TFormattedInstanceConfiguration,
} from "@syncturtle/types";
import { APIService, HttpError } from "./api.service";
import { TFormData } from "@/components/instance/setup-form";

export class InstanceService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  info(): Promise<IInstanceInfo> {
    return this.safeGet<IInstanceInfo>("/api/v1/instances");
  }

  update(data: TInstanceUpdate): Promise<IInstance> {
    return this.safePatch<IInstance>("/api/v1/instances", data);
  }

  admins(): Promise<IInstanceAdmin[]> {
    return this.safeGet<IInstanceAdmin[]>("/api/v1/instances/admins");
  }

  configurations(): Promise<IInstanceConfiguration[]> {
    return this.safeGet<IInstanceConfiguration[]>("/api/v1/instances/configurations");
  }

  updateConfigurations(data: Partial<TFormattedInstanceConfiguration>): Promise<IInstanceConfiguration[]> {
    return this.safePatch<IInstanceConfiguration[]>("/api/v1/instances/configurations", data);
  }

  async instanceSetup(data: TFormData): Promise<void> {
    try {
      const response = await this.post<void>("/api/v1/instances/admins/sign-up", data);
      console.log(response);
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }
}
