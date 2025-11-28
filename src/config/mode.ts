/**
 * Application Mode Configuration
 * 
 * This file handles switching between:
 * - Standalone Mode: Independent backend (Node.js + MongoDB)
 * - Integrated Mode: EduAdminHub backend
 */

export type AppMode = "standalone" | "integrated";

// Get mode from environment variable (default: integrated for backward compatibility)
export const APP_MODE: AppMode = 
  (process.env.NEXT_PUBLIC_MODE as AppMode) || "integrated";

// Mode flags
export const isStandalone = APP_MODE === "standalone";
export const isIntegrated = APP_MODE === "integrated";

// API Configuration based on mode
export const API_CONFIG = {
  standalone: {
    baseUrl: process.env.NEXT_PUBLIC_STANDALONE_API_URL || "http://localhost:5000/api/v1",
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
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.eduadminhub.com/api",
    requiresInstitutionId: true,
    authEndpoints: {
      login: "/loginUser/userId",
      verifyOtp: "/loginUser/verifyOtp",
      getInstitutions: "/getListInstitute/getSpecificList",
    },
  },
};

// Get current API config
export const getApiConfig = () => API_CONFIG[APP_MODE];

// Get API base URL
export const getApiBaseUrl = () => getApiConfig().baseUrl;

// Check if institution ID is required
export const requiresInstitutionId = () => getApiConfig().requiresInstitutionId;

