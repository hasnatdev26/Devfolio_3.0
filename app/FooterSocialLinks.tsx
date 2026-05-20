"use client";

import { useEffect, useState } from "react";
import { defaultSiteLinks, type SiteLinks } from "@/lib/site-links";

export default function FooterSocialLinks() {
  const [links, setLinks] = useState<SiteLinks>(defaultSiteLinks);

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const res = await fetch("/api/site-links");
        const data = await res.json();
        if (data?.ok && data?.data) {
          setLinks({ ...defaultSiteLinks, ...data.data });
        }
      } catch {
        setLinks(defaultSiteLinks);
      }
    };
    loadLinks();
  }, []);

  return (
    <div className="flex items-center justify-start gap-3 pt-1">
      <a
        href={links.facebook || defaultSiteLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="rounded-full border border-blue-700 bg-blue-700 p-2 text-white"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.62.76-1.62 1.55V12h2.76l-.44 2.89h-2.32v6.99A10 10 0 0 0 22 12Z" />
        </svg>
      </a>
      <a
        href={links.linkedin || defaultSiteLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="rounded-full border border-sky-700 bg-sky-700 p-2 text-white"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.68H9.32V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.45v6.3ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56v11.45Z" />
        </svg>
      </a>
      <a
        href={links.github || defaultSiteLinks.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="rounded-full border border-slate-800 bg-slate-800 p-2 text-white"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.82-.25.82-.57v-2.02c-3.34.73-4.04-1.42-4.04-1.42-.54-1.4-1.34-1.77-1.34-1.77-1.1-.76.08-.74.08-.74 1.2.09 1.84 1.24 1.84 1.24 1.08 1.84 2.83 1.31 3.52 1 .1-.78.42-1.31.76-1.62-2.66-.3-5.46-1.34-5.46-5.96 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.53.12-3.2 0 0 1-.33 3.3 1.24a11.4 11.4 0 0 1 6 0c2.28-1.57 3.29-1.24 3.29-1.24.66 1.67.24 2.9.12 3.2.77.84 1.24 1.92 1.24 3.25 0 4.63-2.81 5.65-5.49 5.95.43.37.82 1.11.82 2.25v3.34c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
        </svg>
      </a>
    </div>
  );
}
