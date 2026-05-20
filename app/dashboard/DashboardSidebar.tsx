"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const dashboardLinks = [
  { label: "Overview", href: "/dashboard" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Messages", href: "/dashboard/messages" },
  { label: "Email Signups", href: "/dashboard/email-signups" },
  { label: "Settings", href: "/dashboard/settings" },
] as const;

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="z-20 self-start rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 lg:sticky lg:top-24 lg:p-5">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-violet-700">
        Dashboard
      </p>
      <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
        {dashboardLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={
              isActive(item.href)
                ? "shrink-0 whitespace-nowrap rounded-lg bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700"
                : "shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
