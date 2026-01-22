export interface MetaApiError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
    error_user_title?: string;
    error_user_msg?: string;
    error_data?: unknown;
  };
}

function isMetaApiError(value: unknown): value is MetaApiError {
  if (!value || typeof value !== "object") return false;
  const maybe = value as { error?: unknown };
  if (!maybe.error || typeof maybe.error !== "object") return false;
  const err = maybe.error as {
    message?: unknown;
    type?: unknown;
    code?: unknown;
  };
  return (
    typeof err.message === "string" &&
    typeof err.type === "string" &&
    typeof err.code === "number"
  );
}

export async function metaApiRequest<T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "DELETE";
    accessToken: string;
    apiVersion?: string;
    body?: Record<string, unknown>;
    params?: Record<string, string>;
    formData?: FormData;
  },
): Promise<T> {
  const {
    method = "GET",
    accessToken,
    apiVersion = "v24.0",
    body,
    params,
    formData,
  } = options;

  if (body && formData) {
    throw new Error(
      "metaApiRequest: provide either body or formData, not both",
    );
  }

  let url = `https://graph.facebook.com/${apiVersion}/${endpoint}`;

  const queryParams = new URLSearchParams({
    access_token: accessToken,
    ...(params || {}),
  });
  url += `?${queryParams.toString()}`;

  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : formData,
  });

  const contentType = response.headers.get("content-type") || "";
  const data: unknown = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (isMetaApiError(data)) {
      const userMsg =
        typeof data.error.error_user_msg === "string"
          ? ` User message: ${data.error.error_user_msg}`
          : "";
      const trace =
        typeof data.error.fbtrace_id === "string"
          ? ` (fbtrace_id: ${data.error.fbtrace_id})`
          : "";
      const details = (() => {
        try {
          return ` Details: ${JSON.stringify(data.error)}`;
        } catch {
          return "";
        }
      })();
      throw new Error(
        `Meta API Error (${data.error.code}): ${data.error.message}${
          data.error.error_subcode
            ? ` (subcode: ${data.error.error_subcode})`
            : ""
        }${trace}.${userMsg}${details}`,
      );
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return data as T;
}
