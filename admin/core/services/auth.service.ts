import { API_BASE_URL } from "@/helpers/common.helper";
import { IApiErrorPayload } from "@syncturtle/types";
import { APIService2, HttpError } from "./api.service2";

type TLoginDto = {
  email: string;
  password: string;
};

export class AuthService extends APIService2 {
  constructor() {
    super(API_BASE_URL);
  }

  async login(payload: TLoginDto): Promise<void> {
    try {
      await this.post<void>("/api/v1/auth/admin/login", payload);
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.post<void>("/api/v1/auth/admin/sign-out");
    } catch (error) {
      const err = error as HttpError<void>;
      throw err.data ?? err;
    }
  }
}
