 "use client";

import { FormEvent, useEffect, useState } from "react";
import { defaultAboutProfile, type AboutProfile } from "@/lib/about-profile";

export default function DashboardProfilePage() {
  const [form, setForm] = useState<AboutProfile>(defaultAboutProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/about-profile");
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

  const onUpload = async (file: File | null, target: "coverImage" | "profileImage") => {
    if (!file) return;
    if (file.type && !file.type.startsWith("image/")) {
      setMessage("Only image files are allowed.");
      return;
    }
    if (target === "profileImage") setUploadingProfile(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "about");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data?.ok && data?.imageUrl) {
        setForm((prev) => ({ ...prev, [target]: data.imageUrl as string }));
        setMessage(`${target === "coverImage" ? "Cover" : "Profile"} image uploaded.`);
      } else {
        setMessage(data?.message || "Image upload failed.");
      }
    } catch {
      setMessage("Image upload failed.");
    } finally {
      if (target === "profileImage") setUploadingProfile(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/about-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data?.ok) {
        setMessage("About images updated successfully.");
      } else {
        setMessage("Failed to update about images.");
      }
    } catch {
      setMessage("Failed to update about images.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Profile</p>
      <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">About Profile Images</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        Upload profile photo for your About page from this dashboard section.
      </p>

      <form className="mt-6 space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Upload Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => onUpload(e.target.files?.[0] || null, "profileImage")}
            disabled={uploadingProfile}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-slate-200"
          />
          {uploadingProfile ? <p className="text-xs text-slate-500">Uploading profile image...</p> : null}
        </div>

        <button
          type="submit"
          disabled={loading || saving || uploadingProfile}
          className="w-full rounded-md border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {saving ? "Saving..." : "Save About Images"}
        </button>
      </form>

      {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
