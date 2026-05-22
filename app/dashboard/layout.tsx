import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";

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
    <section aria-label="Dashboard area" className="bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-8 lg:grid-cols-[250px_1fr] lg:px-8 lg:py-10">
        <DashboardSidebar basePath={basePath} />
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
