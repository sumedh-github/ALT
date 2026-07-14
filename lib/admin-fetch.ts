type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface ApiErrorPayload {
  error?: string;
  message?: string;
  details?: unknown;
}

export class ApiRequestError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.details = details;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function request<T>(method: RequestMethod, path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    let payload: ApiErrorPayload = {};
    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch (error) {
      console.error(error);
    }

    throw new ApiRequestError(
      payload.error ?? payload.message ?? "Request failed.",
      response.status,
      payload.details
    );
  }

  return parseResponse<T>(response);
}

export async function adminGet<T>(path: string): Promise<T> {
  return request<T>("GET", path);
}

export async function adminPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>("POST", path, body);
}

export async function adminPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>("PATCH", path, body);
}

export async function adminDelete(path: string): Promise<void> {
  await request<void>("DELETE", path);
}

export async function adminDeleteJson<T>(path: string): Promise<T> {
  return request<T>("DELETE", path);
}
