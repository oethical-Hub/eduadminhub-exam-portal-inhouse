import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
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
  [key: string]: any;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}

export function isTokenExpired(decoded: DecodedToken): boolean {
  if (!decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

export const DEFAULT_TOKEN_EXPIRY_SECONDS = 3600; // 1 hour

// Cookie management utilities
export function setCookie(name: string, value: string, days: number = 7): void {
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
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

