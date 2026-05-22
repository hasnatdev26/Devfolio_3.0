import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  DASHBOARD_AUTH_COOKIE,
  createSessionToken,
  dashboardAuthCookieOptions,
  getDashboardPassword,
  isDashboardAuthConfigured,
} from "@/lib/dashboard-auth";

export async function POST(req: Request) {
  if (!isDashboardAuthConfigured()) {
    return NextResponse.json({ ok: false, message: "Dashboard auth is not configured." }, { status: 503 });
  }

  try {
    const body = (await req.json()) as { password?: string };
    const password = body.password?.trim();
    const expected = getDashboardPassword();

    if (!password || !expected || password !== expected) {
      return NextResponse.json({ ok: false, message: "Invalid password." }, { status: 401 });
    }

    const token = createSessionToken();
    if (!token) {
      return NextResponse.json({ ok: false, message: "Failed to create session." }, { status: 500 });
    }

    const cookieStore = await cookies();
    cookieStore.set(DASHBOARD_AUTH_COOKIE, token, dashboardAuthCookieOptions());

    return NextResponse.json({ ok: true, message: "Signed in." }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(DASHBOARD_AUTH_COOKIE, "", { ...dashboardAuthCookieOptions(0), maxAge: 0 });
  return NextResponse.json({ ok: true, message: "Signed out." }, { status: 200 });
}
