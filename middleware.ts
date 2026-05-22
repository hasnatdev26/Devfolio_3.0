import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getDashboardSecretPath,
  isDashboardAuthConfigured,
  isDashboardSecretPath,
} from "@/lib/dashboard-auth-config";
import { isDashboardRequestAuthenticated } from "@/lib/dashboard-auth-edge";

function notFound() {
  return new NextResponse(null, { status: 404 });
}

function shouldHandlePath(pathname: string) {
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) return true;
  return isDashboardSecretPath(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!shouldHandlePath(pathname)) {
    return NextResponse.next();
  }

  const secretPath = getDashboardSecretPath();
  const isAuthenticated = await isDashboardRequestAuthenticated(request.headers.get("cookie"));

  if (pathname === "/dashboard/login") {
    return notFound();
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return notFound();
  }

  if (!secretPath || !isDashboardAuthConfigured()) {
    return notFound();
  }

  if (!isAuthenticated) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-dashboard-view", "login");
    return NextResponse.rewrite(new URL("/dashboard/login", request.url), {
      request: { headers: requestHeaders },
    });
  }

  const internalPath = pathname.replace(secretPath, "/dashboard") || "/dashboard";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-dashboard-view", "app");
  requestHeaders.set("x-dashboard-base", secretPath);
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = internalPath;
  return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
