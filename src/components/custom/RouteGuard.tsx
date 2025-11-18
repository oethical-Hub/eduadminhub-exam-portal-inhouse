"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const publicRoutes = ["/", "/login", "/forgot-password", "/coming-soon"];

function isPublicPath(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route === pathname) return true;
    if (pathname.startsWith(`${route}/`)) return true;
  });
  return false;
}

export default function RouteGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    // Skip if still checking authentication
    if (token === undefined) return;

    const isPublic = isPublicPath(pathname);

    // If authenticated and on login/forgot-password/coming-soon/home page, redirect to dashboard
    if (isAuthenticated && (pathname === "/login" || pathname === "/" || pathname === "/forgot-password" || pathname === "/coming-soon")) {
      router.replace("/exam-portal/dashboard");
      return;
    }

    // If not authenticated and trying to access protected routes, redirect to login
    if (!isAuthenticated && !isPublic) {
      router.replace("/login");
      return;
    }
  }, [isAuthenticated, pathname, router, token]);

  return null;
}

