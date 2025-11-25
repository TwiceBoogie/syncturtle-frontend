import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService, HttpError } from "./api.service";
import { IApiErrorPayload, IUser, TUserProfile } from "@syncturtle/types";

export class UserService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async currentUser(): Promise<IUser> {
    try {
      const response = await this.get<IUser>("/api/v1/users/me");
      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }

  async getCurrentUserProfile(): Promise<TUserProfile> {
    try {
      const response = await this.get<TUserProfile>("/api/v1/users/me/profile");
      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }
}
