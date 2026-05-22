import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  DASHBOARD_AUTH_COOKIE,
  SESSION_MAX_AGE_MS,
  getAuthSecret,
  getDashboardPassword,
  getDashboardSecretPath,
  isDashboardAuthConfigured,
  isDashboardSecretPath,
} from "@/lib/dashboard-auth-config";

export {
  DASHBOARD_AUTH_COOKIE,
  getDashboardSecretPath,
  isDashboardAuthConfigured,
  isDashboardSecretPath,
  getDashboardPassword,
};

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createSessionToken() {
  const secret = getAuthSecret();
  if (!secret) return null;
  const issuedAt = Date.now().toString();
  const signature = signPayload(`v1:${issuedAt}`, secret);
  return `v1.${issuedAt}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  const secret = getAuthSecret();
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;

  const issuedAt = Number(parts[1]);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > SESSION_MAX_AGE_MS) return false;

  const expected = signPayload(`v1:${parts[1]}`, secret);
  const actual = parts[2];
  if (expected.length !== actual.length) return false;

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
  } catch {
    return false;
  }
}

export function dashboardAuthCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function requireDashboardSession() {
  if (!isDashboardAuthConfigured()) {
    return NextResponse.json({ ok: false, message: "Dashboard auth is not configured." }, { status: 503 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(DASHBOARD_AUTH_COOKIE)?.value;

  if (!verifySessionToken(token)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  return null;
}
