"use client";

import { useCallback, useEffect, useState } from "react";

type ChatMessage = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt?: string;
  repliedAt?: string;
  adminReply?: string;
  status?: string;
  visitorId?: string;
  sender?: "visitor" | "admin";
  seenByAdmin?: boolean;
  quotedMessage?: string;
};

type VisitorThread = {
  id: string;
  title: string;
  subtitle: string;
  phone?: string;
  subject?: string;
  unread: number;
  lastMessageAt: number;
  messages: ChatMessage[];
  visitorId?: string;
  email?: string;
  name?: string;
};

function formatDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardMessagesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedVisitorId, setSelectedVisitorId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [deletingVisitorId, setDeletingVisitorId] = useState<string | null>(null);
  const [selectedQuoteMessageId, setSelectedQuoteMessageId] = useState<string>("");

  const loadMessages = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok && Array.isArray(data.data)) {
        setMessages(data.data);
      } else {
        setMessage(data?.message || "Failed to load messages.");
      }
    } catch {
      setMessage("Failed to load messages.");
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMessages(true);
    }, 0);
    const intervalId = window.setInterval(() => {
      void loadMessages(false);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(intervalId);
    };
  }, [loadMessages]);

  const saveReply = async () => {
    const reply = replyText.trim();
    if (!reply) return;
    if (!activeThread) return;
    const quotedSource = activeThread.messages.find(
      (item) => item._id === selectedQuoteMessageId && item.sender !== "admin"
    );
    setSendingReply(true);
    setMessage("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Admin",
          email: "admin@local.chat",
          subject: activeThread.subject || "",
          visitorId: activeThread.visitorId || activeThread.id,
          recipientEmail: activeThread.email || "",
          recipientName: activeThread.name || activeThread.title || "Visitor",
          message: reply,
          quotedMessage: quotedSource?.message || "",
          sender: "admin",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.message || "Reply send failed.");
      setMessage("Reply sent successfully.");
      setReplyText("");
      setSelectedQuoteMessageId("");
      await loadMessages(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Reply send failed.");
    } finally {
      setSendingReply(false);
    }
  };

  const deleteVisitorThread = async (thread: VisitorThread) => {
    const confirmed = window.confirm("Delete this visitor conversation?");
    if (!confirmed) return;
    setDeletingVisitorId(thread.id);
    setMessage("");
    try {
      const query = thread.visitorId
        ? `visitorId=${encodeURIComponent(thread.visitorId)}`
        : `email=${encodeURIComponent(thread.email || "")}&name=${encodeURIComponent(thread.name || "")}`;
      const res = await fetch(`/api/messages?${query}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.message || "Delete failed.");
      setMessage("Visitor conversation deleted.");
      if (selectedVisitorId === thread.id) {
        setSelectedVisitorId("");
      }
      await loadMessages(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setDeletingVisitorId(null);
    }
  };

  const markThreadAsSeen = useCallback(
    async (thread: VisitorThread | null) => {
      if (!thread) return;
      try {
        await fetch("/api/messages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: thread.visitorId,
            email: thread.email,
            name: thread.name,
            markSeen: true,
          }),
        });
      } catch {
        // ignore seen update failure silently
      }
    },
    []
  );

  const threadsMap = new Map<string, VisitorThread>();
  for (const msg of messages) {
    const key = msg.visitorId || msg.email || msg.name || msg._id;
    const createdMs = msg.createdAt ? new Date(msg.createdAt).getTime() : 0;
    const existing = threadsMap.get(key);
    if (!existing) {
      threadsMap.set(key, {
        id: key,
        title: msg.name || "Visitor",
        subtitle: msg.email || "visitor@local.chat",
        phone: msg.phone || "",
        subject: msg.subject || "",
        unread: msg.sender === "admin" || msg.seenByAdmin ? 0 : 1,
        lastMessageAt: createdMs,
        messages: [msg],
        visitorId: msg.visitorId,
        email: msg.email,
        name: msg.name,
      });
    } else {
      existing.messages.push(msg);
      if (!existing.phone && msg.phone) {
        existing.phone = msg.phone;
      }
      if (!existing.subject && msg.subject) {
        existing.subject = msg.subject;
      }
      existing.unread += msg.sender === "admin" || msg.seenByAdmin ? 0 : 1;
      if (createdMs > existing.lastMessageAt) {
        existing.lastMessageAt = createdMs;
      }
    }
  }

  const threads = Array.from(threadsMap.values())
    .map((thread) => ({
      ...thread,
      messages: [...thread.messages].sort((a, b) => {
        const aMs = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bMs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aMs - bMs;
      }),
    }))
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt);

  const activeVisitorId = selectedVisitorId || threads[0]?.id || "";
  const activeThread = threads.find((item) => item.id === activeVisitorId) || null;
  const selectedQuotedMessageText =
    activeThread?.messages.find((item) => item._id === selectedQuoteMessageId && item.sender !== "admin")?.message ||
    "";

  useEffect(() => {
    void markThreadAsSeen(activeThread);
  }, [activeThread, markThreadAsSeen]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Visitor Messages</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-3xl">Live Chat Inbox</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          New visitor chat ekhane ashbe. Nicher box theke reply likhe save korte parben.
        </p>
        {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600">No messages found.</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
          <aside className="self-start rounded-xl border border-slate-200 bg-white p-3 xl:sticky xl:top-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Visitors</p>
            <div className="space-y-2 xl:max-h-[640px] xl:overflow-y-auto xl:pr-1">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className={
                    activeVisitorId === thread.id
                      ? "rounded-lg border border-violet-200 bg-violet-50 px-3 py-2"
                      : "rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                  }
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVisitorId(thread.id);
                      setSelectedQuoteMessageId("");
                    }}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{thread.title}</p>
                      {thread.unread > 0 && activeVisitorId !== thread.id ? (
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {thread.unread}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 break-all text-xs text-slate-600">{thread.subtitle}</p>
                    {thread.phone ? <p className="mt-1 text-xs text-slate-600">Phone: {thread.phone}</p> : null}
                    {thread.subject ? <p className="mt-1 text-xs text-slate-600">Subject: {thread.subject}</p> : null}
                    <p className="mt-1 text-[11px] leading-4 text-slate-500">
                      {thread.lastMessageAt > 0
                        ? formatDateTime(new Date(thread.lastMessageAt).toISOString())
                        : ""}
                    </p>
                  </button>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => deleteVisitorThread(thread)}
                      disabled={deletingVisitorId === thread.id}
                      className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingVisitorId === thread.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="flex min-h-[640px] flex-col rounded-xl border border-slate-200 bg-white p-4">
            {activeThread ? (
              <>
                <div className="mb-3 border-b border-slate-200 pb-3">
                  <p className="text-base font-semibold text-slate-900">{activeThread.title}</p>
                  <p className="text-sm text-slate-600">{activeThread.subtitle}</p>
                  {activeThread.phone ? <p className="text-sm text-slate-600">Phone: {activeThread.phone}</p> : null}
                  {activeThread.subject ? <p className="text-sm text-slate-600">Subject: {activeThread.subject}</p> : null}
                </div>

                <div className="mb-4 flex-1 space-y-3 overflow-y-auto pr-1">
                  {activeThread.messages.map((item) => (
                    <div key={item._id} className="space-y-1">
                      {item.sender === "admin" ? (
                        <div className="flex justify-end">
                          <div className="max-w-[85%]">
                            <p className="rounded-2xl rounded-br-sm bg-violet-600 px-3 py-2 text-sm text-white">
                              {item.quotedMessage ? (
                                <span className="mb-2 block rounded-md border-l-2 border-violet-200/80 bg-violet-500/60 px-2 py-1 text-xs text-violet-100">
                                  {item.quotedMessage}
                                </span>
                              ) : null}
                              {item.message}
                            </p>
                            <p className="mt-1 text-right text-[11px] text-slate-500">
                              Reply: {formatDateTime(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-start">
                          <div className="max-w-[85%]">
                            <button
                              type="button"
                              onClick={() => setSelectedQuoteMessageId(item._id)}
                              className={
                                selectedQuoteMessageId === item._id
                                  ? "w-full rounded-2xl rounded-bl-sm border border-violet-300 bg-violet-100 px-3 py-2 text-left text-sm text-slate-900"
                                  : "w-full rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-2 text-left text-sm text-slate-800"
                              }
                              title="Click to quote this message"
                            >
                              {item.quotedMessage ? (
                                <span className="mb-2 block rounded-md border-l-2 border-slate-300 bg-white px-2 py-1 text-xs text-slate-600">
                                  {item.quotedMessage}
                                </span>
                              ) : null}
                              {item.message}
                            </button>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                              <span>Sent: {formatDateTime(item.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {item.adminReply ? (
                        <div className="flex justify-end">
                          <div className="max-w-[85%]">
                            <p className="rounded-2xl rounded-br-sm bg-violet-600 px-3 py-2 text-sm text-white">
                              {item.adminReply}
                            </p>
                            <p className="mt-1 text-right text-[11px] text-slate-500">
                              Reply: {formatDateTime(item.repliedAt || item.createdAt)}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="mt-auto space-y-2 border-t border-slate-200 pt-3">
                  {selectedQuotedMessageText ? (
                    <div className="rounded-md border border-violet-200 bg-violet-50 px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Quoted Reply</p>
                      <p className="mt-1 text-sm text-violet-900">{selectedQuotedMessageText}</p>
                      <button
                        type="button"
                        onClick={() => setSelectedQuoteMessageId("")}
                        className="mt-2 text-xs font-semibold text-violet-700 hover:text-violet-900"
                      >
                        Clear Quote
                      </button>
                    </div>
                  ) : null}
                  <label className="block text-sm font-medium text-slate-700">Reply</label>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-violet-600"
                    placeholder="Type your reply..."
                  />
                  <button
                    type="button"
                    onClick={saveReply}
                    disabled={sendingReply}
                    className="inline-flex items-center rounded-md border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sendingReply ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-600">No visitor selected.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
