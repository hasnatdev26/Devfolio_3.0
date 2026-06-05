"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import { FaEnvelope, FaTrashAlt } from "react-icons/fa";

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

const skeletonRows = [1, 2, 3, 4];

export default function DashboardEmailSignupsPage() {
  const [emailSignups, setEmailSignups] = useState<EmailSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [composeForm, setComposeForm] = useState({
    recipientEmail: "",
    sendToAll: false,
    subject: "",
    message: "",
  });
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

  const onDelete = async (item: EmailSignup) => {
    const confirmed = window.confirm(`Delete ${item.email}?`);
    if (!confirmed) return;

    setDeletingId(item._id);
    setMessage("");
    try {
      const res = await fetch(`/api/email-signups/${item._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Failed to delete email signup.");
      }

      setEmailSignups((prev) => prev.filter((signup) => signup._id !== item._id));
      setMessage("Email signup deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete email signup.");
    } finally {
      setDeletingId(null);
    }
  };

  const onSelectRecipient = (email: string) => {
    setComposeForm((prev) => ({ ...prev, recipientEmail: email, sendToAll: false }));
    setMessage("");
  };

  const onSendEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (composeForm.sendToAll) {
      const confirmed = window.confirm(`Send this email to all ${emailSignups.length} signup emails?`);
      if (!confirmed) return;
    }

    setSending(true);
    setMessage("");
    try {
      const res = await fetch("/api/email-signups/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(composeForm),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Failed to send email.");
      }

      setMessage(data?.message || "Email sent successfully.");
      setComposeForm((prev) => ({ ...prev, subject: "", message: "" }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

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

      <form onSubmit={onSendEmail} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="space-y-2">
            <label htmlFor="subscriber-email" className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              To
            </label>
            <input
              id="subscriber-email"
              type="email"
              value={composeForm.recipientEmail}
              onChange={(e) => setComposeForm((prev) => ({ ...prev, recipientEmail: e.target.value }))}
              placeholder={composeForm.sendToAll ? "All signup emails selected" : "user@email.com"}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
              disabled={composeForm.sendToAll}
              required={!composeForm.sendToAll}
            />
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-violet-700">
              <input
                type="checkbox"
                checked={composeForm.sendToAll}
                onChange={(e) =>
                  setComposeForm((prev) => ({
                    ...prev,
                    sendToAll: e.target.checked,
                    recipientEmail: e.target.checked ? "" : prev.recipientEmail,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 accent-violet-700"
                disabled={!emailSignups.length}
              />
              Send to all signups ({emailSignups.length})
            </label>
          </div>
          <div className="space-y-2">
            <label htmlFor="subscriber-subject" className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Subject
            </label>
            <input
              id="subscriber-subject"
              type="text"
              value={composeForm.subject}
              onChange={(e) => setComposeForm((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="Email subject"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
              required
            />
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <label htmlFor="subscriber-message" className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Message
          </label>
          <textarea
            id="subscriber-message"
            value={composeForm.message}
            onChange={(e) => setComposeForm((prev) => ({ ...prev, message: e.target.value }))}
            placeholder="Write email message..."
            rows={5}
            className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
            required
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <FaEnvelope aria-hidden="true" />
          {sending ? "Sending..." : composeForm.sendToAll ? "Send To All" : "Send Email"}
        </button>
      </form>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5" aria-hidden="true">
          <div className="space-y-4 md:hidden">
            {skeletonRows.map((item) => (
              <div key={item} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="skeleton-shimmer relative h-3 w-14 rounded bg-slate-200" />
                    <div className="mt-2 skeleton-shimmer relative h-4 w-full rounded bg-slate-200" />
                  </div>
                  <div className="skeleton-shimmer relative h-3 w-20 rounded bg-slate-200" />
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="skeleton-shimmer relative h-9 flex-1 rounded-md bg-slate-200" />
                  <div className="skeleton-shimmer relative h-9 flex-1 rounded-md bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden overflow-hidden rounded-lg border border-slate-100 md:block">
            <div className="grid grid-cols-[1.4fr_1fr_80px] gap-3 border-b border-slate-100 bg-slate-50 px-3 py-3">
              <div className="skeleton-shimmer relative h-3 w-20 rounded bg-slate-200" />
              <div className="skeleton-shimmer relative h-3 w-28 rounded bg-slate-200" />
              <div className="skeleton-shimmer relative ml-auto h-3 w-12 rounded bg-slate-200" />
            </div>
            {skeletonRows.map((item) => (
              <div key={item} className="grid grid-cols-[1.4fr_1fr_80px] gap-3 border-b border-slate-100 px-3 py-3 last:border-b-0">
                <div className="skeleton-shimmer relative h-3 w-11/12 rounded bg-slate-200" />
                <div className="skeleton-shimmer relative h-3 w-32 rounded bg-slate-200" />
                <div className="ml-auto flex gap-2">
                  <div className="skeleton-shimmer relative h-8 w-8 rounded-md bg-slate-200" />
                  <div className="skeleton-shimmer relative h-8 w-8 rounded-md bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : emailSignups.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600">No email signups yet.</div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="space-y-3 md:hidden">
            {emailSignups.map((item) => (
              <article key={item._id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Email</p>
                    <p className="mt-1 break-all text-sm font-semibold text-slate-900">{item.email}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Subscribed At</p>
                    <p className="mt-1 text-xs text-slate-600">{formatDateTime(item.createdAt)}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectRecipient(item.email)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-violet-300 bg-white px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
                    aria-label={`Compose email to ${item.email}`}
                    title="Compose email"
                  >
                    <FaEnvelope aria-hidden="true" />
                    Compose
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    disabled={deletingId === item._id}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={`Delete ${item.email}`}
                    title="Delete"
                  >
                    <FaTrashAlt aria-hidden="true" className={deletingId === item._id ? "animate-pulse" : ""} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-[560px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="px-2 py-2 font-semibold">Email</th>
                  <th className="px-2 py-2 font-semibold">Subscribed At</th>
                  <th className="px-2 py-2 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {emailSignups.map((item) => (
                  <tr key={item._id} className="border-b border-slate-100">
                    <td className="break-all px-2 py-2 text-slate-800">{item.email}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-slate-600">{formatDateTime(item.createdAt)}</td>
                    <td className="px-2 py-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectRecipient(item.email)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-violet-300 text-violet-700 transition hover:bg-violet-50"
                          aria-label={`Compose email to ${item.email}`}
                          title="Compose email"
                        >
                          <FaEnvelope aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          disabled={deletingId === item._id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-300 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={`Delete ${item.email}`}
                          title="Delete"
                        >
                          <FaTrashAlt aria-hidden="true" className={deletingId === item._id ? "animate-pulse" : ""} />
                        </button>
                      </div>
                    </td>
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
