"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { FaCheckCircle, FaCode, FaComments, FaDatabase, FaLayerGroup, FaLaptopCode, FaPaintBrush, FaWhatsapp } from "react-icons/fa";
import { defaultSiteLinks, type SiteLinks } from "@/lib/site-links";

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

function CountUp({
  end,
  duration = 1800,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [playId, setPlayId] = useState(0);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const node = counterRef.current;
    if (!node) return;
    const isMobile = isMobileViewport();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (isMobile && hasPlayedRef.current) return;
          hasPlayedRef.current = true;
          setPlayId((prev) => prev + 1);
          setIsVisible(true);
        } else {
          if (!isMobile) {
            setIsVisible(false);
            setCount(0);
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let frameId = 0;

    const update = (time: number) => {
      if (startTime === null) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(update);
      }
    };    frameId = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frameId);
  }, [duration, end, isVisible, playId]);

  return (
    <span ref={counterRef}>
      {count}
      {suffix}
    </span>
  );
}

function ScrollAnimatedCard({ children }: { children: ReactNode }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [playId, setPlayId] = useState(0);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const node = cardRef.current;
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
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={cardRef}>
      <div
        key={playId}
        className="animate__animated animate__backInRight rounded-2xl border border-white/35 bg-white/10 p-6 backdrop-blur-md transition hover:bg-white/15"
      >
        {children}
      </div>
    </div>
  );
}

function ScrollReplayGroup({
  children,
}: {
  children: (playId: number) => ReactNode;
}) {
  const groupRef = useRef<HTMLDivElement | null>(null);
  const [playId, setPlayId] = useState(0);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const node = groupRef.current;
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
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={groupRef}>{children(playId)}</div>;
}

function ScrollReplayItem({
  playId,
  delayMs,
  children,
}: {
  playId: number;
  delayMs: number;
  children: ReactNode;
}) {
  return (
    <div
      key={`${playId}-${delayMs}`}
      className="animate__animated animate__backInLeft"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
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
      { threshold: 0.35 }
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

type SkillItem = {
  name: string;
  value: number;
};

type LiveChatItem = {
  _id?: string;
  message: string;
  adminReply?: string;
  createdAt?: string;
  repliedAt?: string;
  sender?: "visitor" | "admin";
};

function formatChatTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SkillProgress({
  item,
  isActive,
  delayMs,
}: {
  item: SkillItem;
  isActive: boolean;
  delayMs: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-800">
        <span>{item.name}</span>
        <span className="text-violet-700">{item.value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-200">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 transition-[width] duration-[1400ms] ease-[cubic-bezier(.22,.61,.36,1)]"
          style={{
            width: isActive ? `${item.value}%` : "0%",
            transitionDelay: `${delayMs}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const techSectionRef = useRef<HTMLElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const [techActive, setTechActive] = useState(false);
  const [links, setLinks] = useState<SiteLinks>(defaultSiteLinks);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatStatus, setChatStatus] = useState("");
  const [isChatSubmitting, setIsChatSubmitting] = useState(false);
  const [chatHistory, setChatHistory] = useState<LiveChatItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = window.localStorage.getItem("live_chat_history");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved) as LiveChatItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [visitorId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const existing = window.localStorage.getItem("live_chat_visitor_id");
    if (existing) return existing;
    const next = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem("live_chat_visitor_id", next);
    return next;
  });

  const frontEndSkills: SkillItem[] = [
    { name: "React.js", value: 90 },
    { name: "Next.js", value: 90 },
    { name: "JavaScript (ES6+)", value: 90 },
    { name: "HTML5", value: 100 },
    { name: "CSS3", value: 90 },
    { name: "Tailwind CSS", value: 100 },
    { name: "TypeScript", value: 85 },
    { name: "Responsive Design", value: 95 },
  ];

  const backEndSkills: SkillItem[] = [
    { name: "Node.js", value: 90 },
    { name: "Express.js", value: 95 },
    { name: "MongoDB", value: 100 },
    { name: "Firebase", value: 95 },
    { name: "JWT Authentication", value: 100 },
    { name: "REST API Design", value: 95 },
    { name: "Mongoose", value: 90 },
    { name: "Socket.IO", value: 80 },
  ];

  useEffect(() => {
    const node = techSectionRef.current;
    if (!node) return;
    const isMobile = isMobileViewport();
    let hasPlayed = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (isMobile && hasPlayed) return;
          hasPlayed = true;
          setTechActive(true);
        } else if (!isMobile) {
          setTechActive(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("live_chat_history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const loadChatThread = useCallback(async () => {
    if (!visitorId) return;
    try {
      const res = await fetch(`/api/messages?visitorId=${encodeURIComponent(visitorId)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.ok && Array.isArray(data.data)) {
        const thread = data.data
          .map(
            (item: {
              _id?: string;
              message?: string;
              adminReply?: string;
              createdAt?: string;
              repliedAt?: string;
              sender?: "visitor" | "admin";
            }) => ({
              _id: item._id,
              message: item.message || "",
              adminReply: item.adminReply || "",
              createdAt: item.createdAt || "",
              repliedAt: item.repliedAt || "",
              sender: item.sender === "admin" ? "admin" : "visitor",
            })
          )
          .filter((item: LiveChatItem) => item.message)
          .reverse();

        setChatHistory(thread);
      }
    } catch {
      // Silent fail to keep chat usable even when polling fails once.
    }
  }, [visitorId]);

  useEffect(() => {
    if (!isLiveChatOpen || !visitorId) return;
    const initialLoadId = window.setTimeout(() => {
      void loadChatThread();
    }, 0);
    const intervalId = window.setInterval(() => {
      void loadChatThread();
    }, 5000);

    return () => {
      window.clearTimeout(initialLoadId);
      window.clearInterval(intervalId);
    };
  }, [isLiveChatOpen, visitorId, loadChatThread]);

  useEffect(() => {
    const node = chatScrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [chatHistory, isLiveChatOpen]);

  const handleLiveChatSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setChatStatus("");
    setIsChatSubmitting(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Website Visitor",
          email: "visitor@local.chat",
          message: chatMessage,
          visitorId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.message || "Failed to send message.");

      setChatStatus("Message sent successfully.");
      setChatMessage("");
      await loadChatThread();
    } catch (error) {
      setChatStatus(error instanceof Error ? error.message : "Failed to send message.");
    } finally {
      setIsChatSubmitting(false);
    }
  };

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
    <>
      <div
        id="home"
        className="relative flex flex-1 font-sans animate-banner-bg"
        style={{
          backgroundImage: "url('/Banner.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
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
        <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="relative z-10 grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <ScrollReplayGroup>
              {(playId) => (
                <div className="space-y-5 sm:space-y-6">
                  <ScrollReplayItem playId={playId} delayMs={0}>
                    <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                      Hello, I&apos;m
                      <span className="mt-2 block text-white">Hasnat Evan</span>
                      <span className="typewriter-text mt-2 text-xl text-white sm:text-3xl">
                        MERN Stack Developer
                      </span>
                    </h1>
                  </ScrollReplayItem>
                  <ScrollReplayItem playId={playId} delayMs={150}>
                    <p className="max-w-xl text-base leading-7 text-white sm:text-lg sm:leading-8">
                      I build fast, scalable, and user-friendly MERN stack web applications.
                    </p>
                  </ScrollReplayItem>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <ScrollReplayItem playId={playId} delayMs={300}>
                      <a
                        href="#contact"
                        className="animate-hire-me inline-flex w-full items-center justify-center rounded-full border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-6 py-3 font-semibold text-white transition hover:brightness-110 sm:w-auto"
                      >
                        Hire Me
                      </a>
                    </ScrollReplayItem>
                    <ScrollReplayItem playId={playId} delayMs={450}>
                      <a
                        href={links.resume || defaultSiteLinks.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full border border-white px-6 py-3 font-semibold text-white transition hover:border-white/80 hover:text-white/80 sm:w-auto"
                      >
                        Download Resume
                      </a>
                    </ScrollReplayItem>
                  </div>
                </div>
              )}
            </ScrollReplayGroup>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <ScrollAnimatedCard>
                <p className="text-4xl font-extrabold text-white"><CountUp end={2} suffix="+" /></p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-white/90">
                  Years Of Experience
                </p>
              </ScrollAnimatedCard>
              <ScrollAnimatedCard>
                <p className="text-4xl font-extrabold text-white"><CountUp end={10} suffix="+" /></p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-white/90">
                  Project Complete
                </p>
              </ScrollAnimatedCard>
              <ScrollAnimatedCard>
                <p className="text-4xl font-extrabold text-white"><CountUp end={99} suffix="%+" /></p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-white/90">
                  Client Satisfaction
                </p>
              </ScrollAnimatedCard>
            </div>
          </div>
        </main>
      </div>

      <section aria-label="Professional profile" className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 pb-0 pt-16 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              <ScrollReplayAnimation animationClass="animate__backInDown" delayMs={0}>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Why Choose Me</p>
              </ScrollReplayAnimation>
              <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={120}>
                <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                  Professional MERN Stack
                  <span className="block">Developer & Problem Solver</span>
                </h2>
              </ScrollReplayAnimation>
              <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={220}>
                <p className="text-lg leading-8 text-slate-600">
                  I am a dedicated MERN Stack Developer who transforms ideas into production-ready web
                  applications. From planning architecture to building polished user interfaces and secure backend
                  systems, I manage the full development lifecycle with clean code, performance, and long-term
                  maintainability in mind.
                </p>
              </ScrollReplayAnimation>
              <ScrollReplayAnimation animationClass="animate__backInUp" delayMs={320}>
                <div className="pt-2">
                  <a
                    href="/about"
                    className="inline-flex items-center rounded-full border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-6 py-3 font-semibold text-white transition hover:brightness-110"
                  >
                    Learn More
                  </a>
                </div>
              </ScrollReplayAnimation>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={0}>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="flex items-center gap-2 font-semibold text-slate-900">
                    <FaCheckCircle className="text-violet-700" />
                    Full Stack Development
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    End-to-end development of complete web applications from UI to database.
                  </p>
                </div>
              </ScrollReplayAnimation>
              <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={120}>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="flex items-center gap-2 font-semibold text-slate-900">
                    <FaCheckCircle className="text-violet-700" />
                    REST API Integration
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Building and integrating reliable APIs for smooth communication between services.
                  </p>
                </div>
              </ScrollReplayAnimation>
              <ScrollReplayAnimation animationClass="animate__backInDown" delayMs={220}>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="flex items-center gap-2 font-semibold text-slate-900">
                    <FaCheckCircle className="text-violet-700" />
                    Authentication & Security
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Implementing secure login systems, authorization flows, and data protection best practices.
                  </p>
                </div>
              </ScrollReplayAnimation>
              <ScrollReplayAnimation animationClass="animate__backInUp" delayMs={320}>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="flex items-center gap-2 font-semibold text-slate-900">
                    <FaCheckCircle className="text-violet-700" />
                    Responsive UI/UX Design
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Designing intuitive, mobile-first interfaces that look great and feel easy to use.
                  </p>
                </div>
              </ScrollReplayAnimation>
            </div>
          </div>
        </div>
      </section>

      <section ref={techSectionRef} aria-label="Technical skills" className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-0 sm:px-6 lg:px-8">
          <div className={`mb-10 max-w-3xl transition-all duration-700 ${techActive ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
            <ScrollReplayAnimation animationClass="animate__backInDown" delayMs={0}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Technical Skills</p>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={120}>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Technical Skills</h2>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={220}>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                My technical skill set covers modern frontend and backend development with a strong focus on performance, scalability, and clean architecture.
              </p>
            </ScrollReplayAnimation>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={80}>
              <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-700 ${techActive ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
                <h3 className="mb-6 text-2xl font-bold text-slate-900">Front-End</h3>
                <div className="space-y-5">
                  {frontEndSkills.map((item, index) => (
                    <SkillProgress key={item.name} item={item} isActive={techActive} delayMs={index * 90} />
                  ))}
                </div>
              </div>
            </ScrollReplayAnimation>

            <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={180}>
              <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all delay-100 duration-700 ${techActive ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
                <h3 className="mb-6 text-2xl font-bold text-slate-900">Back-End</h3>
                <div className="space-y-5">
                  {backEndSkills.map((item, index) => (
                    <SkillProgress key={item.name} item={item} isActive={techActive} delayMs={index * 90 + 120} />
                  ))}
                </div>
              </div>
            </ScrollReplayAnimation>
          </div>
        </div>
      </section>

      <section id="services" aria-label="My skills and services" className="touch-pan-y overflow-x-clip bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <ScrollReplayAnimation animationClass="animate__backInDown" delayMs={0}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
                My Skills & Services
              </p>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={120}>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">My Skills & Services</h2>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={220}>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                I deliver end-to-end digital solutions by combining modern web technologies, clean architecture,
                and user-focused design principles. My goal is to build scalable products that perform reliably
                and create real business value.
              </p>
            </ScrollReplayAnimation>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={0}>
              <article className="group animate-card-border rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-900"><FaCode className="text-violet-700" />Front-End Development</h3>
                <p className="mt-3 leading-7 text-slate-600 transition group-hover:text-slate-700">
                  I build responsive and high-performance interfaces using React.js, Next.js, HTML5, CSS3, and
                  Tailwind CSS, ensuring smooth interactions and consistent design across all devices.
                </p>
              </article>
            </ScrollReplayAnimation>

            <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={120}>
              <article className="group animate-card-border rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-900"><FaDatabase className="text-violet-700" />Back-End Development</h3>
                <p className="mt-3 leading-7 text-slate-600 transition group-hover:text-slate-700">
                  I develop secure and scalable server-side systems with Node.js, Express.js, MongoDB, Firebase,
                  and JWT-based authentication to support reliable application performance.
                </p>
              </article>
            </ScrollReplayAnimation>

            <ScrollReplayAnimation animationClass="animate__backInDown" delayMs={220}>
              <article className="group animate-card-border rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-900"><FaLayerGroup className="text-violet-700" />Other Skills</h3>
                <p className="mt-3 leading-7 text-slate-600 transition group-hover:text-slate-700">
                  I bring strong problem-solving skills with hands-on experience in Git workflows, API
                  integration, deployment pipelines, and performance optimization for full-stack applications.
                </p>
              </article>
            </ScrollReplayAnimation>

            <ScrollReplayAnimation animationClass="animate__backInUp" delayMs={320}>
              <article className="group animate-card-border rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-900"><FaPaintBrush className="text-violet-700" />Graphic Design</h3>
                <p className="mt-3 leading-7 text-slate-600 transition group-hover:text-slate-700">
                  I design visually compelling graphics, logos, and brand-aligned layouts for both digital and
                  print media using modern creative tools.
                </p>
              </article>
            </ScrollReplayAnimation>

            <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={420}>
              <article className="group animate-card-border rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg md:col-span-2 lg:col-span-2">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-900"><FaLaptopCode className="text-violet-700" />Web Design</h3>
                <p className="mt-3 leading-7 text-slate-600 transition group-hover:text-slate-700">
                  I create modern, user-centered, and responsive web designs with a strong focus on usability,
                  accessibility, and visual clarity.
                </p>
              </article>
            </ScrollReplayAnimation>

            <ScrollReplayAnimation animationClass="animate__backInUp" delayMs={520}>
              <article className="group animate-card-border rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg md:col-span-2 lg:col-span-3">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-900"><FaCheckCircle className="text-violet-700" />Full Project Support</h3>
                <p className="mt-3 leading-7 text-slate-600 transition group-hover:text-slate-700">
                  I support your project from idea to deployment, with maintenance and optimization for a stable,
                  secure, and scalable product.
                </p>
              </article>
            </ScrollReplayAnimation>
          </div>
        </div>
      </section>

      <section id="contact" aria-label="Get in touch" className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-0 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl border border-white/25 bg-black/40 p-5 backdrop-blur-md sm:p-8"
            style={{
              backgroundImage: "url('/Banner.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <ScrollReplayAnimation animationClass="animate__bounceInLeft" delayMs={0}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">Get In Touch</p>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__bounceInLeft" delayMs={140}>
              <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-4xl">
                Let&apos;s Build Your Next Project
              </h2>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__bounceInLeft" delayMs={260}>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
                Have an idea in mind? I am available for freelance projects, collaboration, and full-stack web
                development work. Send me a message and let&apos;s discuss how we can bring your idea to life.
              </p>
            </ScrollReplayAnimation>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ScrollReplayAnimation animationClass="animate__bounceInRight" delayMs={360}>
                <a
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-full border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-6 py-3 text-center font-semibold text-white transition hover:brightness-110 sm:w-auto"
                >
                  Go To Contact Page
                </a>
              </ScrollReplayAnimation>
              <ScrollReplayAnimation animationClass="animate__bounceInRight" delayMs={480}>
                <a
                  href="mailto:info@hasnatevan.top"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/60 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto sm:px-6 sm:text-base break-all"
                >
                  info@hasnatevan.top
                </a>
              </ScrollReplayAnimation>
            </div>
          </div>
        </div>
      </section>

      <div className="sr-only">
        <section id="projects" aria-label="Projects" />
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <button
          type="button"
          aria-label="Open live chat"
          onClick={() => setIsLiveChatOpen(true)}
          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-white shadow-[0_10px_24px_rgba(14,165,233,0.45)] transition hover:scale-105 hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 motion-safe:animate-bounce"
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

      {isLiveChatOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-end bg-black/40 p-4 sm:items-center sm:justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Live Chat</h3>
              <button
                type="button"
                onClick={() => setIsLiveChatOpen(false)}
                className="rounded-md px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Conversation</p>
              <div ref={chatScrollRef} className="max-h-52 space-y-2 overflow-y-auto pr-1">
                {chatHistory.length === 0 ? (
                  <p className="text-xs text-slate-500">No message yet. Start a chat.</p>
                ) : (
                  chatHistory.map((item, index) => (
                    <div key={`${item._id || item.message}-${index}`} className="space-y-1">
                      {item.sender === "admin" ? (
                        <div className="flex justify-start">
                          <div className="max-w-[85%]">
                            <p className="rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-xs leading-5 text-slate-700 shadow-sm ring-1 ring-slate-200">
                              {item.message}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-500">
                              {formatChatTime(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <div className="max-w-[85%]">
                            <p className="rounded-2xl rounded-br-sm bg-sky-500 px-3 py-2 text-xs leading-5 text-white shadow-sm">
                              {item.message}
                            </p>
                            <p className="mt-1 text-right text-[10px] text-slate-500">
                              {formatChatTime(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      )}
                      {item.adminReply ? (
                        <div className="flex justify-start">
                          <div className="max-w-[85%]">
                            <p className="rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-xs leading-5 text-slate-700 shadow-sm ring-1 ring-slate-200">
                              {item.adminReply}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-500">
                              {formatChatTime(item.repliedAt || item.createdAt)}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
            <form onSubmit={handleLiveChatSubmit} className="mt-4 space-y-3">
              <textarea
                rows={4}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Write your message..."
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-sky-500"
                required
              />
              <button
                type="submit"
                disabled={isChatSubmitting}
                className="inline-flex w-full items-center justify-center rounded-md bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isChatSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
            {chatStatus ? <p className="mt-3 text-sm text-slate-700">{chatStatus}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}













