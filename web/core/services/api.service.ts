import { IApiErrorPayload } from "@syncturtle/types";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface IRequestConfig {
  params?: Record<string, string | number | boolean | null | undefined>;
  headers?: HeadersInit;
  body?: any;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
  csrf?: boolean; //default true for unsafe methods
  validateStatus?: (status: number) => boolean;
}

export interface IHttpResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
  raw: Response;
}

export class HttpError<T = any> extends Error {
  status: number;
  data: T | null;
  headers: Headers;
  raw: Response;

  constructor(response: Response, data: T | null) {
    super(`HTTP Error ${response.status}`);
    this.status = response.status;
    this.data = data;
    this.headers = response.headers;
    this.raw = response;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export abstract class APIService {
  protected baseURL: string;
  private csrfPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // fetch once per instance
  private async getCsrfToken(): Promise<string> {
    if (!this.csrfPromise) {
      this.csrfPromise = this.get<{ csrfToken: string }>("/api/csrf-token", {
        csrf: false,
      })
        .then((res) => res.data.csrfToken)
        .catch((err) => {
          this.csrfPromise = null;
          throw err;
        });
    }
    return this.csrfPromise;
  }

  private async withCsrfIfNeeded(method: HttpMethod, config: IRequestConfig): Promise<IRequestConfig> {
    const unsafe = method === "POST" || method === "PUT" || method === "DELETE" || method === "PATCH";
    if (config.csrf === false || !unsafe) {
      return config;
    }

    const token = await this.getCsrfToken();

    return {
      ...config,
      headers: {
        ...(config.headers || {}),
        "X-CSRF-TOKEN": token,
      },
    };
  }

  private buildUrl(path: string, params?: IRequestConfig["params"]): string {
    const url = new URL(path, this.baseURL === "" ? window.location.origin : this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          return;
        }
        url.searchParams.set(key, String(value));
      });
    }
    return url.toString();
  }

  private async request<T = any>(
    method: HttpMethod,
    path: string,
    config: IRequestConfig = {}
  ): Promise<IHttpResponse<T>> {
    const configWithCsrf = await this.withCsrfIfNeeded(method, config);
    const { params, headers, body, signal, credentials, validateStatus } = configWithCsrf;

    const url = this.buildUrl(path, params);
    const init: RequestInit = {
      method,
      headers: {
        ...(headers || {}),
      },
      credentials: credentials ?? "include",
      signal,
    };

    if (body !== undefined && body !== null && method !== "GET") {
      if (body instanceof FormData || body instanceof URLSearchParams || typeof body === "string") {
        init.body = body;
      } else {
        init.headers = {
          "Content-Type": "application/json",
          ...(headers || {}),
        };
        init.body = JSON.stringify(body);
      }
    }

    const response = await fetch(url, init);

    let parsed: any = null;
    const text = await response.text();
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch (error) {
        parsed = text;
      }
    }

    const isOk = validateStatus ? validateStatus(response.status) : response.ok;

    if (!isOk) {
      throw new HttpError(response, parsed);
    }

    return {
      data: parsed as T,
      status: response.status,
      headers: response.headers,
      raw: response,
    };
  }

  protected get<T = any>(url: string, config: Omit<IRequestConfig, "body"> = {}): Promise<IHttpResponse<T>> {
    return this.request<T>("GET", url, config);
  }

  protected post<T = any>(
    url: string,
    body?: any,
    config: Omit<IRequestConfig, "body"> = {}
  ): Promise<IHttpResponse<T>> {
    return this.request<T>("POST", url, { ...config, body });
  }

  protected put<T = any>(
    url: string,
    body?: any,
    config: Omit<IRequestConfig, "body"> = {}
  ): Promise<IHttpResponse<T>> {
    return this.request("PUT", url, { ...config, body });
  }

  protected patch<T = any>(
    url: string,
    body?: any,
    config: Omit<IRequestConfig, "body"> = {}
  ): Promise<IHttpResponse<T>> {
    return this.request("PATCH", url, { ...config, body });
  }

  protected delete<T = any>(
    url: string,
    body?: any,
    config: Omit<IRequestConfig, "body"> = {}
  ): Promise<IHttpResponse<T>> {
    return this.request("DELETE", url, { ...config, body });
  }

  protected async safeGet<T = any>(url: string, config: Omit<IRequestConfig, "body"> = {}): Promise<T> {
    try {
      const response = await this.get<T>(url, config);
      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }

  protected async safePatch<T = any>(url: string, body?: any, config: Omit<IRequestConfig, "body"> = {}): Promise<T> {
    try {
      const response = await this.patch<T>(url, body, config);
      return response.data;
    } catch (error) {
      const err = error as HttpError<IApiErrorPayload>;
      throw err.data ?? err;
    }
  }
}
