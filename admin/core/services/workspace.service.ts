import { API_BASE_URL } from "@/helpers/common.helper";
import { TWorkspacePaginationInfo, IApiErrorPayload, IWorkspace } from "@syncturtle/types";
import { ValidationError } from "@/helpers/errors.helper";
import { APIService, HttpError } from "./api.service";

export interface ISlugCheckResponse {
  status: boolean;
}

export interface ICreateWorkspace {
  name: string;
  slug: string;
  organizationSize: string;
  companyRole?: string;
}

export class WorkspaceService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async list(nextPageCursor?: string): Promise<TWorkspacePaginationInfo> {
    try {
      const response = await this.get<TWorkspacePaginationInfo>("/api/v1/instances/workspaces", {
        params: nextPageCursor ? { cursor: nextPageCursor } : undefined,
      });

      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }

  async slugCheck(slug: string): Promise<ISlugCheckResponse> {
    try {
      const response = await this.get<ISlugCheckResponse>("/api/v1/workspaces/slug-check", { params: { slug } });
      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      const payload = err.data;

      if (err.status === 400 && payload?.type === "validation_error") {
        throw new ValidationError(payload.fieldErrors ?? {}, payload.message ?? "Validation failed");
      }

      throw err;
    }
  }

  async create(data: ICreateWorkspace): Promise<IWorkspace> {
    try {
      const response = await this.post<IWorkspace>("/api/v1/instances/workspaces", data);
      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }
}
