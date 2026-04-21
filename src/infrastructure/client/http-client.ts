import type { ApiResponse } from "@/infrastructure/client/api-types";
import { ApiClientError } from "@/infrastructure/client/api-types";

type RequestConfig = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
};

export async function apiRequest<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const response = await fetch(path, {
    method: config.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(config.headers ?? {})
    },
    ...(config.body !== undefined ? { body: JSON.stringify(config.body) } : {})
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? ((await response.json()) as ApiResponse<T>) : null;

  if (!response.ok || !payload?.success) {
    if (!payload) {
      throw new ApiClientError(response.status, "INVALID_RESPONSE", "Unexpected non-JSON response");
    }

    const errorPayload = payload.success
      ? { code: "UNKNOWN_ERROR", message: "Unknown API error", details: undefined }
      : payload.error;

    throw new ApiClientError(
      response.status,
      errorPayload.code,
      errorPayload.message,
      errorPayload.details
    );
  }

  return payload.data;
}
