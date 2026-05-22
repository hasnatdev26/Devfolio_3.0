"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { key: "home", label: "Home", href: "/" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
] as const;

const overlayRoutes = new Set(["/", "/projects", "/about", "/contact"]);
const overlayHeroIds: Record<string, string> = {
  "/": "home",
  "/projects": "projects",
  "/about": "about",
  "/contact": "contact",
};
const NAVBAR_HEIGHT = 64;

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isOverlayPage = overlayRoutes.has(pathname);
  const isOverlayMode = isOverlayPage && !isScrolled && !isOpen;
  const navLinkClass = isOverlayMode
    ? "text-white/90 transition hover:text-white"
    : "text-slate-600 transition hover:text-slate-900";
  const activeLinkClass = isOverlayMode ? "text-white transition" : "text-violet-700 transition";
  const menuButtonClass = isOverlayMode
    ? "border-white/60 text-white hover:border-white hover:text-white"
    : "border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900";
  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const heroId = overlayHeroIds[pathname];
    const handleScroll = () => {
      if (!heroId) {
        setIsScrolled(window.scrollY > 12);
        return;
      }

      const heroSection = document.getElementById(heroId);
      if (!heroSection) {
        setIsScrolled(window.scrollY > 12);
        return;
      }

      const threshold = Math.max(heroSection.offsetHeight - NAVBAR_HEIGHT, 12);
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        isOverlayMode
          ? "border-white/30 bg-transparent"
          : "border-slate-200 bg-white shadow-sm"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Home">
          <Image
            src="/logo-removebg-preview.png"
            alt="Hasnat.Dev logo"
            width={44}
            height={44}
            className="h-11 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActivePath(item.href) ? "page" : undefined}
              className={
                isActivePath(item.href)
                  ? activeLinkClass
                  : navLinkClass
              }
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3" ref={menuRef}>
          <a
            href="/contact"
            className="animate-hire-me rounded-full border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(168,85,247,0.45)] transition hover:brightness-110"
          >
            Hire Me
          </a>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-md border transition md:hidden ${menuButtonClass}`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>

          {isOpen && (
            <div
              id="mobile-menu"
              className="absolute right-4 top-14 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg sm:right-6"
            >
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => {
                    closeMenu();
                  }}
                  aria-current={isActivePath(item.href) ? "page" : undefined}
                  className={
                    isActivePath(item.href)
                      ? "block rounded-lg bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700"
                      : "block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
