import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbarMenuButton from "./DashboardTopbarMenuButton";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const view = headersList.get("x-dashboard-view");
  const basePath = headersList.get("x-dashboard-base") || "";

  if (view === "login") {
    return (
      <section className="relative flex min-h-[100dvh] items-center justify-center overflow-x-hidden px-3 py-6 sm:min-h-screen sm:px-4 sm:py-8 md:px-6">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:bg-fixed"
          style={{ backgroundImage: "url('/Banner.jpeg')" }}
          aria-hidden
        />
        <div className="relative z-10 flex w-full max-w-xl justify-center">{children}</div>
      </section>
    );
  }

  return (
    <section
      aria-label="Dashboard area"
      className="relative min-h-[100dvh] bg-[radial-gradient(circle_at_top_left,_#f8fafc,_#eef2ff_40%,_#e2e8f0_100%)]"
    >
      <div className="w-full px-0 pb-4 pt-0 sm:px-4 sm:py-6 md:px-6 lg:px-8 lg:pb-10 lg:pt-4">
        <DashboardSidebar basePath={basePath} />
        <div className="min-w-0 space-y-4 px-2 pt-[76px] sm:px-0 sm:pt-[84px] md:pt-[62px] lg:ml-[304px] lg:pt-0">
          <header className="fixed inset-x-0 top-0 z-40 border border-violet-300/70 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-3 py-3 text-white shadow-sm backdrop-blur sm:px-5 lg:static lg:z-auto lg:rounded-2xl lg:translate-x-0">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <div className="hidden min-w-0 lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-100">
                  Admin Area
                </p>
                <h1 className="truncate text-lg font-semibold text-white sm:text-xl">Dashboard</h1>
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2 lg:flex-none lg:justify-end">
                <DashboardTopbarMenuButton />
                <div className="min-w-0 truncate rounded-lg border border-white/40 bg-white/15 px-3 py-1.5 text-xs font-medium text-white">
                  Dev Nest Panel
                </div>
              </div>
            </div>
          </header>
          {children}
        </div>
      </div>
    </section>
  );
}
