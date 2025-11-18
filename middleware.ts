import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/", "/login", "/forgot-password", "/coming-soon"];

function isPublicPath(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route === pathname) return true;
    if (pathname.startsWith(`${route}/`)) return true;
  });
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authToken = req.cookies.get("authToken")?.value;
  const isAuthenticated = Boolean(authToken);

  // If authenticated, block access to login, forgot-password, coming-soon, and home page, redirect to dashboard
  if (isAuthenticated && (pathname === "/login" || pathname === "/" || pathname === "/forgot-password" || pathname === "/coming-soon" || pathname.startsWith("/login/"))) {
    const url = req.nextUrl.clone();
    url.pathname = "/exam-portal/dashboard";
    return NextResponse.redirect(url);
  }

  // If not authenticated and trying to access protected routes, redirect to /login
  if (!isAuthenticated && !isPublicPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Match all routes except static files and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

