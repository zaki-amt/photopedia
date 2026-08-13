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

  // Protected paths that require authentication cookie
  const isStrictlyProtected =
    pathname.startsWith("/feed/new") ||
    pathname.startsWith("/profile/edit") ||
    pathname.startsWith("/admin");

  if (isStrictlyProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed/:path*", "/profile/:path*", "/admin/:path*"],
};
