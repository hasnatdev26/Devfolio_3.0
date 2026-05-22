"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECRET_DASHBOARD_PATH = "/hasnat-secret-dashboard-01814197707";

const dashboardLinks = [
  { label: "Overview", href: SECRET_DASHBOARD_PATH },
  { label: "Profile", href: `${SECRET_DASHBOARD_PATH}/profile` },
  { label: "Projects", href: `${SECRET_DASHBOARD_PATH}/projects` },
  { label: "Messages", href: `${SECRET_DASHBOARD_PATH}/messages` },
  { label: "Email Signups", href: `${SECRET_DASHBOARD_PATH}/email-signups` },
  { label: "Settings", href: `${SECRET_DASHBOARD_PATH}/settings` },
] as const;

export default function DashboardSidebar() {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(SECRET_DASHBOARD_PATH, "/dashboard");

  const isActive = (href: string) => {
    const normalizedHref = href.replace(SECRET_DASHBOARD_PATH, "/dashboard");
    if (normalizedHref === "/dashboard") return normalizedPath === "/dashboard";
    return normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
  };

  return (
    <aside className="z-20 self-start rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 lg:sticky lg:top-24 lg:p-5">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-violet-700">
        Dashboard
      </p>
      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col">
        {dashboardLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={
              isActive(item.href)
                ? "rounded-lg bg-violet-50 px-3 py-2 text-center text-xs font-semibold text-violet-700 sm:text-sm lg:text-left"
                : "rounded-lg px-3 py-2 text-center text-xs font-medium text-slate-700 transition hover:bg-slate-100 sm:text-sm lg:text-left"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
