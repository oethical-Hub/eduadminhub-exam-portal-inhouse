import { jwtDecode } from "jwt-decode";

/**
 * Integrated Mode Token (EduAdminHub)
 */
export interface IntegratedDecodedToken {
  user: {
    _id: string;
    userId: string;
    email: string;
    role: string;
    institutionId: string;
    currentAcademicYearId: string;
    permission?: Record<string, string[]>;
  };
  iat: number;
  exp: number;
  [key: string]: unknown;
}

/**
 * Standalone Mode Token (Simple JWT)
 */
export interface StandaloneDecodedToken {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  iat: number;
  exp: number;
  [key: string]: unknown;
}

/**
 * Combined Token Type
 */
export type DecodedToken = IntegratedDecodedToken | StandaloneDecodedToken;

/**
 * Check if token is standalone format
 */
export function isStandaloneToken(decoded: DecodedToken): decoded is StandaloneDecodedToken {
  return 'id' in decoded && !('user' in decoded);
}

/**
 * Check if token is integrated format
 */
export function isIntegratedToken(decoded: DecodedToken): decoded is IntegratedDecodedToken {
  return 'user' in decoded;
}

/**
 * Decode JWT token (supports both standalone and integrated formats)
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(decoded: DecodedToken): boolean {
  if (!decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

/**
 * Get expiry time from token (in seconds)
 */
export function getTokenExpiryTime(decoded: DecodedToken): number {
  if (!decoded.exp) return DEFAULT_TOKEN_EXPIRY_SECONDS;
  return decoded.exp - Math.floor(Date.now() / 1000);
}

export const DEFAULT_TOKEN_EXPIRY_SECONDS = 86400; // 24 hours

// ===== Cookie Management Utilities =====

export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
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

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

/**
 * Clear all auth-related cookies
 */
export function clearAuthCookies(): void {
  deleteCookie("authToken");
  deleteCookie("institutionId");
  deleteCookie("institutionName");
  deleteCookie("userData");
}
