import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET_DASHBOARD_PATH = "/hasnat-secret-dashboard-01814197707";
const DASHBOARD_ACCESS_COOKIE = "dashboard_access";
const DASHBOARD_ACCESS_VALUE = "allowed";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === SECRET_DASHBOARD_PATH || pathname.startsWith(`${SECRET_DASHBOARD_PATH}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(SECRET_DASHBOARD_PATH, "/dashboard");
    const response = NextResponse.rewrite(url);
    response.cookies.set(DASHBOARD_ACCESS_COOKIE, DASHBOARD_ACCESS_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const hasAccess = request.cookies.get(DASHBOARD_ACCESS_COOKIE)?.value === DASHBOARD_ACCESS_VALUE;
    if (hasAccess) return NextResponse.next();
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/hasnat-secret-dashboard-01814197707/:path*"],
};
