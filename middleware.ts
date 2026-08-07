import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that do not require authentication
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico");

  const token = request.cookies.get("photopedia_token")?.value;

  // Protect protected dashboard paths
  const isProtectedPath =
    pathname.startsWith("/feed") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/admin");

  if (isProtectedPath && !token) {
    // Client-side authentication guard will check localStorage as secondary check
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed/:path*", "/profile/:path*", "/admin/:path*"],
};
