/**
 * Application Mode Configuration
 * 
 * This file handles switching between:
 * - Standalone Mode: Independent backend (Node.js + MongoDB)
 * - Integrated Mode: EduAdminHub backend
 * 
 * Mode can be set via:
 * 1. Environment variable: NEXT_PUBLIC_MODE (default mode)
 * 2. Query parameter: ?mode=standalone or ?mode=integrated (runtime override)
 */

export type AppMode = "standalone" | "integrated";

// Default mode from environment variable (fallback: integrated)
export const DEFAULT_MODE: AppMode = 
  (process.env.NEXT_PUBLIC_MODE as AppMode) || "integrated";

// API URLs from environment
export const STANDALONE_API_URL = 
  process.env.NEXT_PUBLIC_STANDALONE_API_URL || "http://localhost:5000/api/v1";

export const INTEGRATED_API_URL = 
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";

// API Configuration for each mode
export const API_CONFIG = {
  standalone: {
    baseUrl: STANDALONE_API_URL,
    requiresInstitutionId: false,
    authEndpoints: {
      login: "/auth/login",
      register: "/auth/register",
      forgotPassword: "/auth/forgot-password",
      resetPassword: "/auth/reset-password",
      me: "/auth/me",
      updatePassword: "/auth/update-password",
    },
  },
  integrated: {
    baseUrl: INTEGRATED_API_URL,
    requiresInstitutionId: true,
    authEndpoints: {
      login: "/api/loginUser/userId",
      verifyOtp: "/api/loginUser/verifyOtp",
      getInstitutions: "/api/getListInstitute/getSpecificList",
    },
  },
};

// Get API config for a specific mode
export const getApiConfig = (mode: AppMode = DEFAULT_MODE) => API_CONFIG[mode];

// Get API base URL for a specific mode
export const getApiBaseUrl = (mode: AppMode = DEFAULT_MODE) => API_CONFIG[mode].baseUrl;

// Check if institution ID is required for a specific mode
export const requiresInstitutionId = (mode: AppMode = DEFAULT_MODE) => 
  API_CONFIG[mode].requiresInstitutionId;

// Legacy exports for backward compatibility (uses default mode)
export const APP_MODE = DEFAULT_MODE;
export const isStandalone = DEFAULT_MODE === "standalone";
export const isIntegrated = DEFAULT_MODE === "integrated";
