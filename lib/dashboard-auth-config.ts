export const DASHBOARD_AUTH_COOKIE = "dashboard_session";
export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function getDashboardSecretPath() {
  const path = process.env.DASHBOARD_SECRET_PATH?.trim();
  if (!path || !path.startsWith("/") || path === "/") return null;
  if (path === "/dashboard" || path.startsWith("/dashboard/")) return null;
  return path.replace(/\/+$/, "");
}

export function isDashboardSecretPath(pathname: string) {
  const secretPath = getDashboardSecretPath();
  if (!secretPath) return false;
  return pathname === secretPath || pathname.startsWith(`${secretPath}/`);
}

export function getDashboardPassword() {
  return process.env.DASHBOARD_PASSWORD?.trim() || null;
}

export function getAuthSecret() {
  return process.env.DASHBOARD_AUTH_SECRET?.trim() || null;
}

export function isDashboardAuthConfigured() {
  return Boolean(getDashboardSecretPath() && getDashboardPassword() && getAuthSecret());
}

export function getSessionTokenFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${DASHBOARD_AUTH_COOKIE}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}
