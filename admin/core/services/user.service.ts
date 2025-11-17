import { API_BASE_URL } from "@/helpers/common.helper";
import { IApiErrorPayload, IUser } from "@syncturtle/types";
import { APIService2, HttpError } from "./api.service2";

export class UserService extends APIService2 {
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
