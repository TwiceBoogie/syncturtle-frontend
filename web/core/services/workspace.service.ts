import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";
import { IWorkspace } from "@syncturtle/types";

export class WorkspaceService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  userWorkspaces(): Promise<IWorkspace[]> {
    return this.safeGet<IWorkspace[]>("/api/v1/users/me/workspaces");
  }
}
