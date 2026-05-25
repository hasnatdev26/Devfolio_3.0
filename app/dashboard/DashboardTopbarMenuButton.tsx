"use client";

import { FiMenu } from "react-icons/fi";

export default function DashboardTopbarMenuButton() {
  const onToggle = () => {
    window.dispatchEvent(new Event("dashboard-sidebar-toggle"));
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center justify-center rounded-lg border border-violet-300 bg-white p-2 text-sm font-semibold text-violet-700 shadow-sm lg:hidden"
      aria-label="Toggle dashboard menu"
    >
      <FiMenu className="h-4 w-4" />
    </button>
  );
}
