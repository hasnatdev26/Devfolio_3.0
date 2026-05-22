"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const dashboardLinks = [
  { label: "Overview", suffix: "" },
  { label: "Profile", suffix: "/profile" },
  { label: "Projects", suffix: "/projects" },
  { label: "Messages", suffix: "/messages" },
  { label: "Email Signups", suffix: "/email-signups" },
  { label: "Settings", suffix: "/settings" },
] as const;

type DashboardSidebarProps = {
  basePath: string;
};

export default function DashboardSidebar({ basePath }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === basePath) return pathname === basePath;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  async function handleSignOut() {
    await fetch("/api/dashboard-auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <aside className="z-20 self-start rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 lg:sticky lg:top-24 lg:p-5">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-violet-700">
        Dashboard
      </p>
      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col">
        {dashboardLinks.map((item) => {
          const href = `${basePath}${item.suffix}`;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={
                isActive(href)
                  ? "rounded-lg bg-violet-50 px-3 py-2 text-center text-xs font-semibold text-violet-700 sm:text-sm lg:text-left"
                  : "rounded-lg px-3 py-2 text-center text-xs font-medium text-slate-700 transition hover:bg-slate-100 sm:text-sm lg:text-left"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={handleSignOut}
        className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:text-sm"
      >
        Sign out
      </button>
    </aside>
  );
}
