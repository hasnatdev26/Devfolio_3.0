import type { Metadata } from "next";
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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <section aria-label="Dashboard area" className="bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-8 lg:grid-cols-[250px_1fr] lg:px-8 lg:py-10">
        <DashboardSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
