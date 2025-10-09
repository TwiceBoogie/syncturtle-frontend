import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { IUser, TUserProfile } from "@syncturtle/types";

export class UserService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async currentUser(): Promise<IUser> {
    // Using validateStatus: null to bypass interceptors for unauthorized errors.
    return this.get("/api/v1/users/me/", { validateStatus: null })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }

  async getCurrentUserProfile(): Promise<TUserProfile> {
    return this.get("/api/v1/users/me/profile/")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }
}
