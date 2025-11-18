"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { decodeToken, isTokenExpired, DEFAULT_TOKEN_EXPIRY_SECONDS, getCookie, setCookie, deleteCookie } from "@/lib/auth";
import { User, UserRole } from "@/types/auth";

interface AuthContextType {
  token: string | null | undefined;
  user: User | null;
  institutionId: string | null;
  institutionName: string | null;
  login: (token: string, user: User, institutionId: string, institutionName?: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: undefined,
  user: null,
  institutionId: null,
  institutionName: null,
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

  // Initialize when app loads
  useEffect(() => {
    const storedToken = getCookie("authToken");
    const storedInstitutionId = getCookie("institutionId");
    const storedInstitutionName = getCookie("institutionName");
    const storedUser = getCookie("userData");

    if (storedToken && storedInstitutionId) {
      const decoded = decodeToken(storedToken);

      if (decoded && !isTokenExpired(decoded)) {
        setToken(storedToken);
        setInstitutionId(storedInstitutionId);
        setInstitutionName(storedInstitutionName);
        
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            // If user data is invalid, use decoded token data
            if (decoded.user) {
              setUser({
                _id: decoded.user._id,
                institutionId: decoded.user.institutionId,
                username: decoded.user.email,
                firstName: "",
                lastName: "",
                primaryMobileNumber: "",
                email: decoded.user.email,
                role: decoded.user.role,
                permission: decoded.user.permission,
                status: true,
                userId: decoded.user.userId,
                currentAcademicYearId: decoded.user.currentAcademicYearId,
              });
            }
          }
        }
      } else {
        // Token expired or invalid
        deleteCookie("authToken");
        deleteCookie("institutionId");
        deleteCookie("institutionName");
        deleteCookie("userData");
        setToken(null);
        setUser(null);
        setInstitutionId(null);
        setInstitutionName(null);
      }
    } else {
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

      if (newToken && newInstitutionId) {
        const decoded = decodeToken(newToken);
        if (decoded && !isTokenExpired(decoded)) {
          setToken(newToken);
          setInstitutionId(newInstitutionId);
          if (newUser) {
            try {
              setUser(JSON.parse(newUser));
            } catch {
              // Handle error
            }
          }
        } else {
          setToken(null);
          setUser(null);
          setInstitutionId(null);
          setInstitutionName(null);
        }
      } else {
        setToken(null);
        setUser(null);
        setInstitutionId(null);
        setInstitutionName(null);
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

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

    // Calculate expiry time
    const expiryTime = decoded.exp ? decoded.exp * 1000 - Date.now() : DEFAULT_TOKEN_EXPIRY_SECONDS * 1000;
    const days = Math.ceil(expiryTime / (24 * 60 * 60 * 1000));

    // Store in cookies
    setCookie("authToken", newToken, days);
    setCookie("institutionId", newInstitutionId, days);
    if (newInstitutionName) {
      setCookie("institutionName", newInstitutionName, days);
    }
    setCookie("userData", JSON.stringify(newUser), days);

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
      if (token) {
        // Call logout API if needed
        // await api.post("/user/logout", {}, token);
      }
    } catch (err: any) {
      console.error("Logout error:", err);
    } finally {
      // Clear cookies
      deleteCookie("authToken");
      deleteCookie("institutionId");
      deleteCookie("institutionName");
      deleteCookie("userData");

      setToken(null);
      setUser(null);
      setInstitutionId(null);
      setInstitutionName(null);

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

  const isAuthenticated = useMemo(() => {
    return Boolean(token && user && institutionId);
  }, [token, user, institutionId]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      token,
      user,
      institutionId,
      institutionName,
      login,
      logout,
      isAuthenticated,
    }),
    [token, user, institutionId, institutionName, login, logout, isAuthenticated]
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

