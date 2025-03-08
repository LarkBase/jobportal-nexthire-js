import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // Redirect authenticated users away from /login
  if (accessToken && request.nextUrl.pathname.startsWith("/login")) {
    if (userRole === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/super-admin-dashboard", request.url));
    } else if (userRole === "CANDIDATE") {
      return NextResponse.redirect(new URL("/candidate-profile", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect unauthenticated users to /login for protected routes
  if (!accessToken && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based redirection for protected routes
  if (accessToken) {
    if (request.nextUrl.pathname.startsWith("/super-admin-dashboard") && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (request.nextUrl.pathname.startsWith("/candidate-profile") && userRole !== "CANDIDATE") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};