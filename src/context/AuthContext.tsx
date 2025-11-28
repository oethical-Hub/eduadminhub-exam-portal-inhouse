"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { decodeToken, isTokenExpired, DEFAULT_TOKEN_EXPIRY_SECONDS, getCookie, setCookie, deleteCookie } from "@/lib/auth";
import { User } from "@/types/auth";

interface AuthContextType {
  token: string | null | undefined;
  user: User | null;
  institutionId: string | null;
  institutionName: string | null;
  isStandaloneMode: boolean;
  login: (token: string, user: User, institutionId: string, institutionName?: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: undefined,
  user: null,
  institutionId: null,
  institutionName: null,
  isStandaloneMode: false,
  login: () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [institutionName, setInstitutionName] = useState<string | null>(null);
  const router = useRouter();

  // Check if standalone mode based on institutionId
  const isStandaloneMode = institutionId === "standalone";

  // Initialize when app loads
  useEffect(() => {
    const storedToken = getCookie("authToken");
    const storedInstitutionId = getCookie("institutionId");
    const storedInstitutionName = getCookie("institutionName");
    const storedUser = getCookie("userData");

    // Check if standalone mode
    const isStandalone = storedInstitutionId === "standalone";

    // In standalone mode, just need token; in integrated mode, need both token and institutionId
    const hasRequiredData = isStandalone 
      ? Boolean(storedToken) 
      : Boolean(storedToken && storedInstitutionId);

    if (hasRequiredData) {
      const decoded = decodeToken(storedToken!);

      if (decoded && !isTokenExpired(decoded)) {
        setToken(storedToken);
        setInstitutionId(storedInstitutionId);
        setInstitutionName(storedInstitutionName);
        
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            // If user data is invalid, try to extract from token
            // This handles both standalone and integrated token formats
            console.error("Failed to parse stored user data");
          }
        }
      } else {
        // Token expired or invalid - clear everything
        clearAuth();
      }
    } else {
      // No valid auth data
      setToken(null);
      setUser(null);
      setInstitutionId(null);
      setInstitutionName(null);
    }

    // React to login/logout across tabs
    const handleAuthChange = () => {
      const newToken = getCookie("authToken");
      const newInstitutionId = getCookie("institutionId");
      const newUser = getCookie("userData");
      const newInstitutionName = getCookie("institutionName");

      const isStandaloneCheck = newInstitutionId === "standalone";
      const hasRequiredDataForChange = isStandaloneCheck 
        ? Boolean(newToken) 
        : Boolean(newToken && newInstitutionId);

      if (hasRequiredDataForChange) {
        const decoded = decodeToken(newToken!);
        if (decoded && !isTokenExpired(decoded)) {
          setToken(newToken);
          setInstitutionId(newInstitutionId);
          setInstitutionName(newInstitutionName);
          if (newUser) {
            try {
              setUser(JSON.parse(newUser));
            } catch {
              // Handle error
            }
          }
        } else {
          clearAuthState();
        }
      } else {
        clearAuthState();
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  // Clear auth state helper
  const clearAuthState = () => {
    setToken(null);
    setUser(null);
    setInstitutionId(null);
    setInstitutionName(null);
  };

  // Clear auth cookies and state
  const clearAuth = () => {
    deleteCookie("authToken");
    deleteCookie("institutionId");
    deleteCookie("institutionName");
    deleteCookie("userData");
    clearAuthState();
  };

  // Auto-logout on token expiry
  useEffect(() => {
    if (!token) return;

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return;

    const expiryTime = decoded.exp * 1000 - Date.now();
    if (expiryTime <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
      toast.info("Your session has expired. Please login again.");
    }, expiryTime);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Login function
  const login = useCallback((newToken: string, newUser: User, newInstitutionId: string, newInstitutionName?: string) => {
    const decoded = decodeToken(newToken);
    if (!decoded) {
      toast.error("Invalid token");
      return;
    }

    // Calculate expiry time (default 24 hours if not in token)
    const expiryTime = decoded.exp ? decoded.exp * 1000 - Date.now() : DEFAULT_TOKEN_EXPIRY_SECONDS * 1000;
    const days = Math.max(1, Math.ceil(expiryTime / (24 * 60 * 60 * 1000)));

    // Store in cookies
    setCookie("authToken", newToken, days);
    setCookie("institutionId", newInstitutionId, days);
    if (newInstitutionName) {
      setCookie("institutionName", newInstitutionName, days);
    }
    setCookie("userData", JSON.stringify(newUser), days);

    // Update state
    setToken(newToken);
    setUser(newUser);
    setInstitutionId(newInstitutionId);
    setInstitutionName(newInstitutionName || null);

    // Dispatch event for multi-tab sync
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new Event("authChange"));
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    if (!token && !user) return;

    try {
      // Call logout API if needed (for integrated mode)
      // if (token && !isStandaloneMode) {
      //   await api.post("/user/logout", {}, token);
      // }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear everything
      clearAuth();

      // Dispatch event for multi-tab sync
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new Event("authChange"));
      }

      // Redirect to login
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [router, token, user]);

  // Check if authenticated
  const isAuthenticated = useMemo(() => {
    // For standalone mode (institutionId === "standalone"), just need token and user
    // For integrated mode, need all three
    if (institutionId === "standalone") {
      return Boolean(token && user);
    }
    return Boolean(token && user && institutionId);
  }, [token, user, institutionId]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      token,
      user,
      institutionId,
      institutionName,
      isStandaloneMode,
      login,
      logout,
      isAuthenticated,
    }),
    [token, user, institutionId, institutionName, isStandaloneMode, login, logout, isAuthenticated]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
