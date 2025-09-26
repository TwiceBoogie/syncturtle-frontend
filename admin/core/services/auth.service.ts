import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { ICsrfTokenData } from "@syncturtle/types";

export class AuthService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async requestCSRFToken(): Promise<ICsrfTokenData> {
    return this.get("/api/csrf-token", { validateStatus: null })
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }
}
