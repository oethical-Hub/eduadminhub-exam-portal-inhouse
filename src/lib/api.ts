import { getApiBaseUrl, isStandalone, requiresInstitutionId } from "@/config/mode";

//======= Get API Base URL based on mode
const API_BASE_URL = getApiBaseUrl();

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  user?: any;
  auth?: string;
  token?: string; 
  userImage?: string;
  total?: number;
}

//==== Get institution ID from cookie (only for integrated mode)
function getInstitutionId(): string | null {
  //===== Standalone mode doesn't need institution ID
  if (isStandalone) return null;
  
  if (typeof document === "undefined") return null;
  const nameEQ = "institutionId" + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

async function request<T = unknown>(
  endpoint: string,
  method: string = "GET",
  body?: unknown,
  token?: string | null,
  institutionId?: string | null
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  //==== Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  //==== Add institution ID header only for integrated mode
  if (requiresInstitutionId()) {
    const instId = institutionId || getInstitutionId();
    if (instId) {
      headers["x-institution-id"] = instId;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error: unknown) {
    const err = error as Error;
    console.error("API Error:", err);
    throw error;
  }
}

export const api = {
  get: <T = unknown>(endpoint: string, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "GET", undefined, token, institutionId),

  post: <T = unknown>(endpoint: string, body?: unknown, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "POST", body, token, institutionId),

  put: <T = unknown>(endpoint: string, body?: unknown, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "PUT", body, token, institutionId),

  patch: <T = unknown>(endpoint: string, body?: unknown, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "PATCH", body, token, institutionId),

  delete: <T = unknown>(endpoint: string, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "DELETE", undefined, token, institutionId),
};

//==== Export mode info for components
export { isStandalone, API_BASE_URL };
