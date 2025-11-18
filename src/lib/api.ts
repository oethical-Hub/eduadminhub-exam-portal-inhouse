const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.eduadminhub.com/api";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: any;
  auth?: string;
  userImage?: string;
  total?: number;
}

//==== Get institution ID from cookie
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

async function request<T = any>(
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string | null,
  institutionId?: string | null
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  //==== Add institution ID header
  const instId = institutionId || getInstitutionId();
  if (instId) {
    headers["x-institution-id"] = instId;
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
  } catch (error: any) {
    console.error("API Error:", error);
    throw error;
  }
}

export const api = {
  get: <T = any>(endpoint: string, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "GET", undefined, token, institutionId),

  post: <T = any>(endpoint: string, body?: any, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "POST", body, token, institutionId),

  put: <T = any>(endpoint: string, body?: any, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "PUT", body, token, institutionId),

  delete: <T = any>(endpoint: string, token?: string | null, institutionId?: string | null) =>
    request<T>(endpoint, "DELETE", undefined, token, institutionId),
};

