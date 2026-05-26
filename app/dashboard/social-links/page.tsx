"use client";

import { FormEvent, useEffect, useState } from "react";

type SiteLinks = {
  facebook: string;
  linkedin: string;
  github: string;
  resume: string;
};

const initialState: SiteLinks = {
  facebook: "",
  linkedin: "",
  github: "",
  resume: "",
};

export default function DashboardSocialLinksPage() {
  const [form, setForm] = useState<SiteLinks>(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/site-links");
        const data = await res.json();
        if (data?.ok && data?.data) {
          setForm(data.data);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/site-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data?.ok) {
        setMessage("Links updated successfully.");
      } else {
        setMessage("Failed to update links.");
      }
    } catch {
      setMessage("Failed to update links.");
    } finally {
      setSaving(false);
    }
  };

  const onChange = (key: keyof SiteLinks, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Social Links</p>
      <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Social Media and Resume</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        Add or update your social media links and resume URL from this dedicated page.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          type="url"
          placeholder="Facebook URL"
          value={form.facebook}
          onChange={(e) => onChange("facebook", e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
        />
        <input
          type="url"
          placeholder="LinkedIn URL"
          value={form.linkedin}
          onChange={(e) => onChange("linkedin", e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
        />
        <input
          type="url"
          placeholder="GitHub URL"
          value={form.github}
          onChange={(e) => onChange("github", e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
        />
        <input
          type="url"
          placeholder="Resume URL"
          value={form.resume}
          onChange={(e) => onChange("resume", e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
        />

        <button
          type="submit"
          disabled={loading || saving}
          className="w-full rounded-md border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {saving ? "Saving..." : "Save Links"}
        </button>
      </form>

      {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
