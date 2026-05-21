 "use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { FaFolderOpen } from "react-icons/fa";

type ProjectItem = {
  _id: string;
  imageUrl: string;
  liveUrl: string;
};

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

function ScrollReplayAnimation({
  children,
  animationClass,
  delayMs = 0,
}: {
  children: ReactNode;
  animationClass: string;
  delayMs?: number;
}) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [playId, setPlayId] = useState(0);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const node = itemRef.current;
    if (!node) return;
    const isMobile = isMobileViewport();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (isMobile && hasPlayedRef.current) return;
          hasPlayedRef.current = true;
          setPlayId((prev) => prev + 1);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={itemRef}>
      <div
        key={playId}
        className={`animate__animated ${animationClass}`}
        style={{ animationDelay: `${delayMs}ms` }}
      >
        {children}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const skeletonCards = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data?.ok && Array.isArray(data?.data)) {
          setProjectList(data.data);
        }
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  return (
    <>
      <section id="projects" aria-label="Projects banner" className="w-full bg-white">
        <div className="relative overflow-hidden bg-white">
          <Image
            src="/Banner.jpeg"
            alt="Projects banner"
            width={1400}
            height={500}
            className="h-[220px] w-full object-cover object-right sm:h-[280px] md:h-[330px] animate-banner-image"
            priority
          />
          <div className="bubble-layer" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, index) => (
              <span key={`projects-bubble-${index}`} className="bubble" />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-black/45" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <h1 className="flex items-center gap-3 text-4xl font-bold uppercase tracking-wide text-white sm:text-5xl">
              <FaFolderOpen className="text-3xl sm:text-4xl" />
              Projects
            </h1>
          </div>
        </div>
      </section>

      <section aria-label="Projects list" className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <ScrollReplayAnimation animationClass="animate__backInDown" delayMs={0}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">My Work</p>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={100}>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Featured Projects</h2>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={180}>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                These projects reflect my hands-on experience in designing and developing complete web solutions, from responsive front-end interfaces to secure and efficient back-end systems. I focus on performance, scalability, clean architecture, and user-centered design so each product is both technically strong and easy to use in real-world scenarios.
              </p>
            </ScrollReplayAnimation>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {skeletonCards.map((item) => (
                <article key={item} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="skeleton-shimmer relative h-56 w-full bg-slate-200" />
                  <div className="space-y-3 p-5">
                    <div className="skeleton-shimmer relative h-4 w-2/3 rounded-lg bg-slate-200" />
                    <div className="skeleton-shimmer relative h-10 w-full rounded-xl bg-slate-200" />
                  </div>
                </article>
              ))}
            </div>
          ) : null}
          {!loading && projectList.length === 0 ? (
            <ScrollReplayAnimation animationClass="animate__fadeInUp" delayMs={0}>
              <p className="text-sm text-slate-600">No projects available right now.</p>
            </ScrollReplayAnimation>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectList.map((project, index) => (
              <ScrollReplayAnimation
                key={project._id}
                animationClass="animate__backInUp"
                delayMs={Math.min(index * 120, 420)}
              >
                <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative bg-gradient-to-br from-slate-100 via-white to-violet-50">
                    <div className="overflow-hidden rounded-t-3xl border-b border-slate-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl}
                      alt="Project image"
                      className="block h-96 w-full bg-white object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    </div>
                  </div>
                  <div className="p-5">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-xl border border-violet-300 bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                    >
                      Live Preview
                    </a>
                  </div>
                </article>
              </ScrollReplayAnimation>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
