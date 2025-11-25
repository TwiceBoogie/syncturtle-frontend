import { API_BASE_URL } from "@/helpers/common.helper";
import { IUser, IApiErrorPayload } from "@syncturtle/types";
import { APIService, HttpError } from "./api.service";

export class UserService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async currentUser(): Promise<IUser> {
    try {
      const response = await this.get<IUser>("/api/v1/users/me");
      return response.data;
    } catch (error: unknown) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }
}
