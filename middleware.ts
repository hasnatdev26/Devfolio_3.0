import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET_DASHBOARD_PATH = "/hasnat-secret-dashboard-01814197707";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === SECRET_DASHBOARD_PATH || pathname.startsWith(`${SECRET_DASHBOARD_PATH}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(SECRET_DASHBOARD_PATH, "/dashboard");
    return NextResponse.rewrite(url);
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/hasnat-secret-dashboard-01814197707",
    "/hasnat-secret-dashboard-01814197707/:path*",
  ],
};
