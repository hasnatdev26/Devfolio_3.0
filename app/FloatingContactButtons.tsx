"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FaComments, FaWhatsapp } from "react-icons/fa";

export default function FloatingContactButtons() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLiveChatClick = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("open_live_chat_once", "1");
      window.dispatchEvent(new Event("open-live-chat"));
    }

    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <button
        type="button"
        onClick={handleLiveChatClick}
        aria-label="Open live chat"
        className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-white shadow-[0_10px_24px_rgba(14,165,233,0.45)] transition hover:scale-105 hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
      >
        <FaComments className="text-3xl" />
      </button>
      <a
        href="https://wa.me/8801814197707"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.45)] transition hover:scale-105 hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      >
        <FaWhatsapp className="text-4xl" />
        <span className="absolute -right-1 -top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
          1
        </span>
      </a>
    </div>
  );
}
