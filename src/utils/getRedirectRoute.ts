import { UserRole } from "@/types/auth";

export function getRedirectRoute(role: UserRole): string {
  const normalizedRole = role?.toLowerCase() || "";

  // Admin/Teacher roles
  if (
    normalizedRole.includes("admin") ||
    normalizedRole.includes("administration") ||
    normalizedRole.includes("teacher") ||
    normalizedRole.includes("tutor")
  ) {
    return "/exam-portal/dashboard";
  }

  // Student role
  if (normalizedRole.includes("student")) {
    return "/exam-portal/student-dashboard";
  }

  // Parent role
  if (normalizedRole.includes("parent")) {
    return "/exam-portal/student-dashboard"; // Parents can view student dashboard
  }

  // Default redirect
  return "/exam-portal/dashboard";
}

