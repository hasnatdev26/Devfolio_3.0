"use client";

import { useCallback, useEffect, useState } from "react";

type EmailSignup = {
  _id: string;
  email: string;
  createdAt?: string;
};

function formatDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardEmailSignupsPage() {
  const [emailSignups, setEmailSignups] = useState<EmailSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadEmailSignups = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetch("/api/email-signups", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok && Array.isArray(data.data)) {
        setEmailSignups(data.data);
      } else {
        setMessage(data?.message || "Failed to load email signups.");
      }
    } catch {
      setMessage("Failed to load email signups.");
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadEmailSignups(true);
    }, 0);
    const intervalId = window.setInterval(() => {
      void loadEmailSignups(false);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(intervalId);
    };
  }, [loadEmailSignups]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Email Signups</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-3xl">Newsletter Subscribers</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Footer email signup list ekhane show hobe.
        </p>
        {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600">Loading email signups...</div>
      ) : emailSignups.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600">No email signups yet.</div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="overflow-x-auto">
            <table className="min-w-[560px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="px-2 py-2 font-semibold">Email</th>
                  <th className="px-2 py-2 font-semibold">Subscribed At</th>
                </tr>
              </thead>
              <tbody>
                {emailSignups.map((item) => (
                  <tr key={item._id} className="border-b border-slate-100">
                    <td className="break-all px-2 py-2 text-slate-800">{item.email}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-slate-600">{formatDateTime(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
