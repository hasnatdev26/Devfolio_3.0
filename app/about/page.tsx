 "use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FaEnvelope, FaFacebookF, FaGithub, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { defaultSiteLinks, type SiteLinks } from "@/lib/site-links";
import { defaultAboutProfile, type AboutProfile } from "@/lib/about-profile";

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

export default function AboutPage() {
  const [links, setLinks] = useState<SiteLinks>(defaultSiteLinks);
  const [aboutProfile, setAboutProfile] = useState<AboutProfile>(defaultAboutProfile);

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

  useEffect(() => {
    const loadAboutProfile = async () => {
      try {
        const res = await fetch("/api/about-profile");
        const data = await res.json();
        if (data?.ok && data?.data) {
          setAboutProfile({ ...defaultAboutProfile, ...data.data });
        }
      } catch {
        setAboutProfile(defaultAboutProfile);
      }
    };
    loadAboutProfile();
  }, []);

  return (
    <>
      <section id="about" aria-label="About" className="w-full bg-white">
        <div className="relative overflow-hidden bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={aboutProfile.coverImage || defaultAboutProfile.coverImage}
            alt="About banner"
            className="h-[220px] w-full object-cover object-right sm:h-[280px] md:h-[330px] animate-banner-image"
          />
          <div className="bubble-layer" aria-hidden="true">
            <span className="bubble" />
            <span className="bubble" />
            <span className="bubble" />
            <span className="bubble" />
            <span className="bubble" />
            <span className="bubble" />
            <span className="bubble" />
            <span className="bubble" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-black/45" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <h1 className="flex items-center gap-3 text-4xl font-bold uppercase tracking-wide text-white sm:text-5xl">
              <FaUserCircle className="text-3xl sm:text-4xl" />
              About
            </h1>
          </div>
        </div>
      </section>

      <section aria-label="About me">
        <div className="mx-auto w-full max-w-6xl px-4 pb-0 pt-10 sm:px-6 sm:pt-12 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-600" />
            <div className="grid lg:grid-cols-[1fr_1.35fr]">
              <aside className="border-b border-slate-200 bg-white lg:border-b-0 lg:border-r">
                <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={0}>
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={aboutProfile.profileImage || defaultAboutProfile.profileImage}
                      alt="Hasnat Evan portrait"
                      className="h-[240px] w-full object-cover object-top sm:h-[300px]"
                    />
                  </div>
                </ScrollReplayAnimation>
                <div className="px-6 py-5 text-center">
                  <ScrollReplayAnimation animationClass="animate__backInUp" delayMs={80}>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">MOHAMMAD AZIMUL HASNAT</h2>
                  </ScrollReplayAnimation>
                  <ScrollReplayAnimation animationClass="animate__backInUp" delayMs={150}>
                    <p className="mt-2 text-lg font-medium text-violet-700">Full-Stack Web Developer</p>
                  </ScrollReplayAnimation>
                </div>
              </aside>

              <div className="bg-slate-50/80 p-5 sm:p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <ScrollReplayAnimation animationClass="animate__backInDown" delayMs={40}>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">About</p>
                    </ScrollReplayAnimation>
                    <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={110}>
                      <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-4xl">About Me</h2>
                    </ScrollReplayAnimation>
                  </div>
                  <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={180}>
                    <div className="flex shrink-0 self-start items-center gap-2.5 sm:gap-3">
                      <a
                        href={links.facebook || defaultSiteLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-700 bg-blue-700 text-white transition hover:brightness-110"
                      >
                        <FaFacebookF className="text-sm" />
                      </a>
                      <a
                        href={links.linkedin || defaultSiteLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky-700 bg-sky-700 text-white transition hover:brightness-110"
                      >
                        <FaLinkedinIn className="text-sm" />
                      </a>
                      <a
                        href={links.github || defaultSiteLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-800 text-white transition hover:brightness-110"
                      >
                        <FaGithub className="text-sm" />
                      </a>
                    </div>
                  </ScrollReplayAnimation>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
                  <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={240}>
                    <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:text-lg">
                      I am MOHAMMAD AZIMUL HASNAT, a full-stack web developer based in Chattogram, Bangladesh. I build modern,
                      responsive, and scalable web applications with a strong focus on clean architecture, performance,
                      and long-term maintainability.
                    </p>
                  </ScrollReplayAnimation>
                  <div className="space-y-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/40 p-3.5 sm:p-5">
                    <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={300}>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                          <FaPhoneAlt className="text-xs" />
                        </span>
                        <a href="tel:+8801814197707" className="min-w-0 break-all text-sm font-semibold text-slate-700 hover:text-violet-700 sm:text-base">
                          +8801814197707
                        </a>
                      </div>
                    </ScrollReplayAnimation>
                    <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={360}>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                          <FaEnvelope className="text-xs" />
                        </span>
                        <a href="mailto:hasnatevan59@gmail.com" className="min-w-0 truncate whitespace-nowrap text-sm font-semibold text-slate-700 hover:text-violet-700 sm:text-base">
                          hasnatevan59@gmail.com
                        </a>
                      </div>
                    </ScrollReplayAnimation>
                    <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={420}>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                          <FaMapMarkerAlt className="text-xs" />
                        </span>
                        <span className="min-w-0 truncate whitespace-nowrap text-sm font-semibold text-slate-700 sm:text-base">Chattogram, Bangladesh</span>
                      </div>
                    </ScrollReplayAnimation>
                    <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={480}>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                          <FaRegUserCircle className="text-sm" />
                        </span>
                        <span className="text-right text-sm font-semibold text-slate-700 sm:text-base">23</span>
                      </div>
                    </ScrollReplayAnimation>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Education journey" className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <ScrollReplayAnimation animationClass="animate__backInDown" delayMs={0}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Education</p>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={120}>
              <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Academic
                <span> Background</span>
              </h2>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={220}>
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                My academic journey built a strong foundation in analytical thinking, communication, and technical
                problem-solving, helping me grow into a confident full-stack web developer.
              </p>
            </ScrollReplayAnimation>
          </div>

          <div className="mt-8 grid items-start gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-4 border-l-2 border-violet-200 pl-4 sm:space-y-5 sm:pl-5">
              <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={80}>
                <article className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
                <span className="absolute -left-[23px] top-7 h-3.5 w-3.5 rounded-full border-2 border-white bg-violet-600 sm:-left-[30px] sm:top-8" />
                <p className="inline-flex rounded-full bg-violet-700 px-3 py-1 text-xs font-semibold text-white">
                  2021
                </p>
                <h3 className="mt-3 text-lg font-semibold text-slate-900 sm:text-xl">Secondary School Certificate (SSC)</h3>
                <p className="mt-1 font-medium text-violet-700">BGC Academy School & College</p>
                <p className="mt-2 text-slate-700">Discipline: Business Studies</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                  Completed SSC with solid academic performance and developed a strong base in disciplined study.
                </p>
                </article>
              </ScrollReplayAnimation>

              <ScrollReplayAnimation animationClass="animate__backInUp" delayMs={180}>
                <article className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
                <span className="absolute -left-[23px] top-7 h-3.5 w-3.5 rounded-full border-2 border-white bg-violet-600 sm:-left-[30px] sm:top-8" />
                <p className="inline-flex rounded-full bg-violet-700 px-3 py-1 text-xs font-semibold text-white">
                  2021 - 2025
                </p>
                <h3 className="mt-3 text-lg font-semibold text-slate-900 sm:text-xl">Diploma in Engineering</h3>
                <p className="mt-1 font-medium text-violet-700">National Institute of Technology</p>
                <p className="mt-2 text-slate-700">Major: Computer Science and Engineering (CSE)</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                  Completed diploma coursework with practical training in software fundamentals, systems thinking,
                  and real-world technical communication.
                </p>
                </article>
              </ScrollReplayAnimation>

              <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={280}>
                <article className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
                <span className="absolute -left-[23px] top-7 h-3.5 w-3.5 rounded-full border-2 border-white bg-violet-600 sm:-left-[30px] sm:top-8" />
                <p className="inline-flex rounded-full bg-violet-700 px-3 py-1 text-xs font-semibold text-white">
                  2024
                </p>
                <h3 className="mt-3 text-lg font-semibold text-slate-900 sm:text-xl">Web Development Course</h3>
                <p className="mt-1 font-medium text-violet-700">Programming Hero</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                  Completed a comprehensive hands-on program focused on responsive UI, JavaScript, React, and
                  practical project development.
                </p>
                </article>
              </ScrollReplayAnimation>
            </div>

            <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={220}>
              <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">
                Education Highlights
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <li>Strong foundation in software fundamentals and engineering workflow.</li>
                <li>Practical experience from structured coursework and project-based learning.</li>
                <li>Continuous self-learning through modern web development training.</li>
              </ul>
              <a
                href={links.resume || defaultSiteLinks.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-6 py-3 text-center font-semibold text-white transition hover:brightness-110 sm:w-auto"
              >
                View Resume
              </a>
              </aside>
            </ScrollReplayAnimation>
          </div>
        </div>
      </section>
    </>
  );
}
