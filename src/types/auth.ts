export interface User {
  _id: string;
  institutionId: string;
  username: string;
  employeeId?: string;
  firstName: string;
  lastName: string;
  primaryMobileNumber: string;
  alternateMobileNumber?: string;
  email: string;
  role: string;
  permission?: Record<string, string[]>;
  status: boolean;
  userId: string;
  currentAcademicYearId: string;
  userImage?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  auth?: string;
  userImage?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  institutionId: string;
}

export interface VerifyOtpRequest {
  otp: string;
}

export type UserRole = "Administration" | "Teacher" | "Student" | "Parent" | string;

