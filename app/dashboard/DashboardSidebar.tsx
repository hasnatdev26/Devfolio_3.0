"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";

const dashboardLinks = [
  { label: "Profile", suffix: "/profile" },
  { label: "Projects", suffix: "/projects" },
  { label: "Messages", suffix: "/messages" },
  { label: "Email Signups", suffix: "/email-signups" },
] as const;

type DashboardSidebarProps = {
  basePath: string;
};

export default function DashboardSidebar({ basePath }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("dashboard-sidebar-toggle", handleToggle);
    return () => window.removeEventListener("dashboard-sidebar-toggle", handleToggle);
  }, []);

  const isActive = (href: string) => {
    if (href === basePath) return pathname === basePath;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  async function handleSignOut() {
    await fetch("/api/dashboard-auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/45 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[86%] max-w-[300px] flex-col border-r border-violet-200/70 bg-gradient-to-b from-violet-50 via-white to-fuchsia-50 p-3 shadow-xl shadow-violet-200/50 transition-transform duration-300 sm:p-4 lg:fixed lg:left-8 lg:top-4 lg:z-20 lg:h-[calc(100dvh-2rem)] lg:w-[280px] lg:max-w-none lg:rounded-2xl lg:border lg:p-5 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
      <div className="mb-4 flex items-center justify-center gap-3 rounded-xl border border-violet-200/80 bg-white/80 p-2.5 text-center backdrop-blur">
        <Image
          src="/logo.jpg"
          alt="Portfolio logo"
          width={36}
          height={36}
          className="h-9 w-9 rounded-md object-cover"
          priority
        />
        <p className="text-sm font-semibold text-violet-700">Dev Nest</p>
      </div>
      <h2 className="mb-4 text-left text-lg font-semibold text-violet-900">Dashboard Panel</h2>
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {dashboardLinks.map((item) => {
          const href = `${basePath}${item.suffix}`;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => setIsOpen(false)}
              className={
                isActive(href)
                  ? "flex items-center justify-between rounded-lg border border-violet-500 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-3 py-2 text-left text-xs font-semibold text-white shadow-sm sm:text-sm"
                  : "flex items-center justify-between rounded-lg border border-transparent px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800 sm:text-sm"
              }
            >
              <span>{item.label}</span>
              <FiChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={handleSignOut}
        className="mt-4 w-full rounded-lg border border-violet-300 bg-white px-3 py-2 text-xs font-medium text-violet-700 transition hover:bg-violet-50 sm:text-sm lg:mt-auto"
      >
        Sign out
      </button>
      </aside>
    </>
  );
}
