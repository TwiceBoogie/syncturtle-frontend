import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService, HttpError } from "./api.service";
import { IApiErrorPayload, IUser, IUserSettings, TUserProfile } from "@syncturtle/types";

export class UserService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  currentUser(): Promise<IUser> {
    return this.safeGet<IUser>("/api/v1/users/me");
  }

  getCurrentUserProfile(): Promise<TUserProfile> {
    return this.safeGet<TUserProfile>("/api/v1/users/me/profile");
  }

  currentUserSettings(): Promise<IUserSettings> {
    return this.safeGet<IUserSettings>("/api/v1/users/me/settings");
  }
}
