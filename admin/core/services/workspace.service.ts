import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { TWorkspacePaginationInfo } from "@syncturtle/types";

export class WorkspaceService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async list(nextPageCursor?: string): Promise<TWorkspacePaginationInfo> {
    return this.get(`/api/v1/instances/workspaces`, {
      params: {
        cursor: nextPageCursor,
      },
    })
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
