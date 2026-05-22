import {
  SESSION_MAX_AGE_MS,
  getAuthSecret,
  getSessionTokenFromCookieHeader,
  isDashboardAuthConfigured,
} from "@/lib/dashboard-auth-config";

function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function signPayload(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToHex(signature);
}

export async function verifySessionTokenEdge(token: string | undefined | null) {
  if (!token) return false;
  const secret = getAuthSecret();
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;

  const issuedAt = Number(parts[1]);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > SESSION_MAX_AGE_MS) return false;

  const expected = await signPayload(`v1:${parts[1]}`, secret);
  return safeEqualHex(parts[2], expected);
}

export async function isDashboardRequestAuthenticated(cookieHeader: string | null) {
  if (!isDashboardAuthConfigured()) return false;
  return verifySessionTokenEdge(getSessionTokenFromCookieHeader(cookieHeader));
}
