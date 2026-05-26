"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { FaEnvelope } from "react-icons/fa";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

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

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      setSubmitMessage("Name, email and message are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.message || "Failed to send message.");
      setSubmitMessage("Message sent successfully.");
      form.reset();
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="contact" aria-label="Contact banner" className="-mt-16 w-full bg-white pt-16">
        <div className="relative overflow-hidden bg-white">
          <Image
            src="/Banner.jpeg"
            alt="Contact banner"
            width={1400}
            height={500}
            className="h-[220px] w-full object-cover object-right sm:h-[280px] md:h-[330px] animate-banner-image"
            priority
          />
          <div className="bubble-layer" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, index) => (
              <span key={`contact-bubble-${index}`} className="bubble" />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-black/45" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <h1 className="flex items-center gap-3 text-4xl font-bold uppercase tracking-wide text-white sm:text-5xl">
              <FaEnvelope className="text-3xl sm:text-4xl" />
              Contact
            </h1>
          </div>
        </div>
      </section>

      <section aria-label="Get in touch" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <ScrollReplayAnimation animationClass="animate__backInDown" delayMs={0}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Get In Touch</p>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={120}>
              <h2 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Let&apos;s Talk For your
                <span className="block">Next Projects</span>
              </h2>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={220}>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Have an idea, project, or collaboration in mind? Share your requirements and I will get back to
                you with the best possible solution for your next web project.
              </p>
            </ScrollReplayAnimation>

            <ScrollReplayAnimation animationClass="animate__backInUp" delayMs={320}>
              <div className="space-y-4 text-slate-700">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-900">Address</p>
                  <p>Chittagong, Bangladesh</p>
                </div>
                <div>
                  <a href="mailto:hasnatevan59@gmail.com" className="transition hover:text-slate-900">
                    hasnatevan59@gmail.com
                  </a>
                </div>
                <div>
                  <a href="tel:+8801814197707" className="transition hover:text-slate-900">
                    +8801814197707
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-900">Follow Me</p>
                  <div className="mt-3 flex items-center gap-3">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-700 bg-blue-700 text-white"
                    >
                      <FaFacebookF className="text-sm" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-700 bg-sky-700 text-white"
                    >
                      <FaLinkedinIn className="text-sm" />
                    </a>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-800 text-white"
                    >
                      <FaGithub className="text-sm" />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReplayAnimation>
          </div>

          <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={120}>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <ScrollReplayAnimation animationClass="animate__fadeInUp" delayMs={180}>
                  <div>
                    <label htmlFor="full-name" className="mb-2 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <input
                      id="full-name"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Enter your full name"
                      className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    />
                  </div>
                </ScrollReplayAnimation>
                <ScrollReplayAnimation animationClass="animate__fadeInUp" delayMs={240}>
                  <div>
                    <label htmlFor="email-address" className="mb-2 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      placeholder="Enter your email address"
                      className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    />
                  </div>
                </ScrollReplayAnimation>
                <ScrollReplayAnimation animationClass="animate__fadeInUp" delayMs={300}>
                  <div>
                    <label htmlFor="phone-number" className="mb-2 block text-sm font-medium text-slate-700">
                      Phone Number
                    </label>
                    <input
                      id="phone-number"
                      name="phone"
                      type="text"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="Enter your phone number"
                      className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    />
                  </div>
                </ScrollReplayAnimation>
                <ScrollReplayAnimation animationClass="animate__fadeInUp" delayMs={360}>
                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700">
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Write your subject"
                      className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    />
                  </div>
                </ScrollReplayAnimation>
                <ScrollReplayAnimation animationClass="animate__fadeInUp" delayMs={420}>
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Write your message"
                      className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    />
                  </div>
                </ScrollReplayAnimation>
                <ScrollReplayAnimation animationClass="animate__backInUp" delayMs={480}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center rounded-md border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-5 py-3 font-semibold text-white shadow-[0_0_18px_rgba(168,85,247,0.45)] transition hover:brightness-110"
                  >
                    {isSubmitting ? "Sending..." : "Send Us Message ->"}
                  </button>
                </ScrollReplayAnimation>
                {submitMessage ? <p className="text-sm text-slate-700">{submitMessage}</p> : null}
              </form>
            </div>
          </ScrollReplayAnimation>
        </div>
      </section>

      <section aria-label="Contact support info" className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <ScrollReplayAnimation animationClass="animate__backInDown" delayMs={0}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Quick Help</p>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={120}>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Need More Information?</h3>
            </ScrollReplayAnimation>
            <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={220}>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                If you have questions about project timeline, budget, or technology stack, send a message and I will
                respond as soon as possible.
              </p>
            </ScrollReplayAnimation>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ScrollReplayAnimation animationClass="animate__backInLeft" delayMs={80}>
              <div className="group animate-card-border rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg">
                <p className="text-lg font-semibold text-slate-900">Response Time</p>
                <p className="mt-3 leading-7 text-slate-600 transition group-hover:text-slate-700">
                  Usually within 24 hours.
                </p>
              </div>
            </ScrollReplayAnimation>

            <ScrollReplayAnimation animationClass="animate__backInUp" delayMs={180}>
              <div className="group animate-card-border rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg">
                <p className="text-lg font-semibold text-slate-900">Work Type</p>
                <p className="mt-3 whitespace-nowrap leading-7 text-slate-600 transition group-hover:text-slate-700">
                  MERN web apps, UI updates, bug fixing.
                </p>
              </div>
            </ScrollReplayAnimation>

            <ScrollReplayAnimation animationClass="animate__backInRight" delayMs={280}>
              <div className="group animate-card-border rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg sm:col-span-2 lg:col-span-1">
                <p className="text-lg font-semibold text-slate-900">Availability</p>
                <p className="mt-3 whitespace-nowrap leading-7 text-slate-600 transition group-hover:text-slate-700">
                  Remote work, global clients.
                </p>
              </div>
            </ScrollReplayAnimation>
          </div>
        </div>
      </section>
    </>
  );
}
