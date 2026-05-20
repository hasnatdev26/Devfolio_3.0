"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerNavItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function FooterQuickLinks() {
  const pathname = usePathname();
  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex flex-col gap-2">
      {footerNavItems.map((item) => {
        const isActive = isActivePath(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "text-violet-700 transition"
                : "transition hover:text-slate-900"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
