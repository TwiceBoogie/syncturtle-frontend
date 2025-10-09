import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { IUser } from "@syncturtle/types";

export class UserService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async currentUser(): Promise<IUser> {
    return this.get(`/api/v1/users/me`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
