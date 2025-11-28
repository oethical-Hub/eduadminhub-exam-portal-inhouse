import { 
  AppMode, 
  DEFAULT_MODE, 
  getApiBaseUrl, 
  requiresInstitutionId as checkRequiresInstitutionId,
  STANDALONE_API_URL,
  INTEGRATED_API_URL
} from "@/config/mode";

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

interface RequestOptions {
  token?: string | null;
  institutionId?: string | null;
  mode?: AppMode; // Allow overriding mode per request
}

//==== Get institution ID from cookie (only for integrated mode)
function getInstitutionId(): string | null {
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
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { token, institutionId, mode = DEFAULT_MODE } = options;
  
  // Get the correct API URL based on mode
  const baseUrl = getApiBaseUrl(mode);
  const url = `${baseUrl}${endpoint}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  //==== Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  //==== Add institution ID header only for integrated mode
  if (checkRequiresInstitutionId(mode)) {
    const instId = institutionId || getInstitutionId();
    if (instId) {
      headers["x-institution-id"] = instId;
    }
  }

  const requestOptions: RequestInit = {
    method,
    headers,
  };

  if (body && method !== "GET") {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, requestOptions);
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

// Standard API object (uses default mode from env)
export const api = {
  get: <T = unknown>(
    endpoint: string, 
    token?: string | null, 
    institutionId?: string | null
  ) => request<T>(endpoint, "GET", undefined, { token, institutionId }),

  post: <T = unknown>(
    endpoint: string, 
    body?: unknown, 
    token?: string | null, 
    institutionId?: string | null
  ) => request<T>(endpoint, "POST", body, { token, institutionId }),

  put: <T = unknown>(
    endpoint: string, 
    body?: unknown, 
    token?: string | null, 
    institutionId?: string | null
  ) => request<T>(endpoint, "PUT", body, { token, institutionId }),

  patch: <T = unknown>(
    endpoint: string, 
    body?: unknown, 
    token?: string | null, 
    institutionId?: string | null
  ) => request<T>(endpoint, "PATCH", body, { token, institutionId }),

  delete: <T = unknown>(
    endpoint: string, 
    token?: string | null, 
    institutionId?: string | null
  ) => request<T>(endpoint, "DELETE", undefined, { token, institutionId }),
};

// Standalone Mode API (always uses standalone URL)
export const standaloneApi = {
  get: <T = unknown>(endpoint: string, token?: string | null) =>
    request<T>(endpoint, "GET", undefined, { token, mode: "standalone" }),

  post: <T = unknown>(endpoint: string, body?: unknown, token?: string | null) =>
    request<T>(endpoint, "POST", body, { token, mode: "standalone" }),

  put: <T = unknown>(endpoint: string, body?: unknown, token?: string | null) =>
    request<T>(endpoint, "PUT", body, { token, mode: "standalone" }),

  patch: <T = unknown>(endpoint: string, body?: unknown, token?: string | null) =>
    request<T>(endpoint, "PATCH", body, { token, mode: "standalone" }),

  delete: <T = unknown>(endpoint: string, token?: string | null) =>
    request<T>(endpoint, "DELETE", undefined, { token, mode: "standalone" }),
};

// Integrated Mode API (always uses EduAdminHub URL)
export const integratedApi = {
  get: <T = unknown>(endpoint: string, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "GET", undefined, { token, institutionId, mode: "integrated" }),

  post: <T = unknown>(endpoint: string, body?: unknown, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "POST", body, { token, institutionId, mode: "integrated" }),

  put: <T = unknown>(endpoint: string, body?: unknown, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "PUT", body, { token, institutionId, mode: "integrated" }),

  patch: <T = unknown>(endpoint: string, body?: unknown, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "PATCH", body, { token, institutionId, mode: "integrated" }),

  delete: <T = unknown>(endpoint: string, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "DELETE", undefined, { token, institutionId, mode: "integrated" }),
};

//==== Export URLs for reference
export const API_URLS = {
  standalone: STANDALONE_API_URL,
  integrated: INTEGRATED_API_URL,
};

//==== Export mode info for components (legacy)
export { DEFAULT_MODE as APP_MODE };
export const isStandalone = DEFAULT_MODE === "standalone";
