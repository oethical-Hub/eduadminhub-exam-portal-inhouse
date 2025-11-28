/**
 * User interface - works for both Standalone and Integrated modes
 * 
 * Standalone mode: Some fields may be optional/empty
 * Integrated mode: All fields from EduAdminHub
 */
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: boolean;
  
  // Optional fields (may not be present in standalone mode)
  institutionId?: string;
  username?: string;
  employeeId?: string;
  primaryMobileNumber?: string;
  alternateMobileNumber?: string;
  phone?: string; // Standalone mode uses 'phone'
  permission?: Record<string, string[]>;
  userId?: string;
  currentAcademicYearId?: string;
  userImage?: string;
  
  // Standalone mode specific
  mfaEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Integrated mode login response
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  auth?: string; // Integrated mode token field
  userImage?: string;
}

// Standalone mode login response
export interface StandaloneLoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

// Integrated mode login request
export interface LoginRequest {
  username: string;
  password: string;
  institutionId: string;
}

// Standalone mode login request
export interface StandaloneLoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  otp: string;
}

export type UserRole = "admin" | "teacher" | "student" | "parent" | "Administration" | "Teacher" | "Student" | "Parent" | string;
