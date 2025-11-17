import { API_BASE_URL } from "@/helpers/common.helper";
import {
  IInstanceInfo,
  TInstanceUpdate,
  IInstance,
  IInstanceAdmin,
  IInstanceConfiguration,
  TFormattedInstanceConfiguration,
  IApiErrorPayload,
} from "@syncturtle/types";
import { APIService2, HttpError } from "./api.service2";

export class InstanceService extends APIService2 {
  constructor() {
    super(API_BASE_URL);
  }

  async info(): Promise<IInstanceInfo> {
    try {
      const response = await this.get<IInstanceInfo>("/api/v1/instances");
      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }

  async update(data: TInstanceUpdate): Promise<IInstance> {
    try {
      const response = await this.patch<IInstance>("/api/v1/instances", data);
      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }

  async admins(): Promise<IInstanceAdmin[]> {
    try {
      const response = await this.get<IInstanceAdmin[]>("/api/v1/instances/admins");
      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }

  async configurations(): Promise<IInstanceConfiguration[]> {
    try {
      const response = await this.get<IInstanceConfiguration[]>("/api/v1/instances/configurations");
      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }

  async updateConfigurations(data: Partial<TFormattedInstanceConfiguration>): Promise<IInstanceConfiguration[]> {
    try {
      const response = await this.patch<IInstanceConfiguration[]>("/api/v1/instances/configurations", data);
      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }
}
