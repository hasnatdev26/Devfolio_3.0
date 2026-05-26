"use client";

import { FormEvent, useEffect, useState } from "react";
import { defaultAboutProfile, type AboutProfile } from "@/lib/about-profile";

type SiteLinks = {
  facebook: string;
  linkedin: string;
  github: string;
  resume: string;
};

const initialLinksState: SiteLinks = {
  facebook: "",
  linkedin: "",
  github: "",
  resume: "",
};

export default function DashboardProfilePage() {
  const [profileForm, setProfileForm] = useState<AboutProfile>(defaultAboutProfile);
  const [linksForm, setLinksForm] = useState<SiteLinks>(initialLinksState);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingLinks, setSavingLinks] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [linksMessage, setLinksMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, linksRes] = await Promise.all([
          fetch("/api/about-profile"),
          fetch("/api/site-links"),
        ]);

        const profileData = await profileRes.json();
        const linksData = await linksRes.json();

        if (profileData?.ok && profileData?.data) {
          setProfileForm(profileData.data);
        }
        if (linksData?.ok && linksData?.data) {
          setLinksForm(linksData.data);
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
      setProfileMessage("Only image files are allowed.");
      return;
    }
    if (target === "coverImage") setUploadingCover(true);
    if (target === "profileImage") setUploadingProfile(true);
    setProfileMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "about");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data?.ok && data?.imageUrl) {
        setProfileForm((prev) => ({ ...prev, [target]: data.imageUrl as string }));
        setProfileMessage(`${target === "coverImage" ? "Cover" : "Profile"} image uploaded.`);
      } else {
        setProfileMessage(data?.message || "Image upload failed.");
      }
    } catch {
      setProfileMessage("Image upload failed.");
    } finally {
      if (target === "coverImage") setUploadingCover(false);
      if (target === "profileImage") setUploadingProfile(false);
    }
  };

  const onProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");
    try {
      const res = await fetch("/api/about-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (data?.ok) {
        setProfileMessage("About images updated successfully.");
      } else {
        setProfileMessage("Failed to update about images.");
      }
    } catch {
      setProfileMessage("Failed to update about images.");
    } finally {
      setSavingProfile(false);
    }
  };

  const onLinksSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSavingLinks(true);
    setLinksMessage("");
    try {
      const res = await fetch("/api/site-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linksForm),
      });
      const data = await res.json();
      if (data?.ok) {
        setLinksMessage("Social links updated successfully.");
      } else {
        setLinksMessage("Failed to update social links.");
      }
    } catch {
      setLinksMessage("Failed to update social links.");
    } finally {
      setSavingLinks(false);
    }
  };

  const onLinksChange = (key: keyof SiteLinks, value: string) => {
    setLinksForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Profile</p>
      <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Profile and Social Media</h1>

      <form className="mt-6 space-y-5" onSubmit={onProfileSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Upload Cover Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onUpload(e.target.files?.[0] || null, "coverImage")}
            disabled={uploadingCover}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-slate-200"
          />
          {uploadingCover ? <p className="text-xs text-slate-500">Uploading cover image...</p> : null}
          {profileForm.coverImage ? (
            <p className="break-all text-xs text-slate-500">Current cover: {profileForm.coverImage}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Upload Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onUpload(e.target.files?.[0] || null, "profileImage")}
            disabled={uploadingProfile}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-slate-200"
          />
          {uploadingProfile ? <p className="text-xs text-slate-500">Uploading profile image...</p> : null}
          {profileForm.profileImage ? (
            <p className="break-all text-xs text-slate-500">Current profile: {profileForm.profileImage}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading || savingProfile || uploadingCover || uploadingProfile}
          className="w-full rounded-md border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {savingProfile ? "Saving..." : "Save About Images"}
        </button>
      </form>

      {profileMessage ? <p className="mt-3 text-sm text-slate-600">{profileMessage}</p> : null}

      <div className="my-8 h-px w-full bg-slate-200" />

      <form className="space-y-4" onSubmit={onLinksSubmit}>
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Social Media and Resume</h2>
        <input
          type="url"
          placeholder="Facebook URL"
          value={linksForm.facebook}
          onChange={(e) => onLinksChange("facebook", e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
        />
        <input
          type="url"
          placeholder="LinkedIn URL"
          value={linksForm.linkedin}
          onChange={(e) => onLinksChange("linkedin", e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
        />
        <input
          type="url"
          placeholder="GitHub URL"
          value={linksForm.github}
          onChange={(e) => onLinksChange("github", e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
        />
        <input
          type="url"
          placeholder="Resume URL"
          value={linksForm.resume}
          onChange={(e) => onLinksChange("resume", e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
        />

        <button
          type="submit"
          disabled={loading || savingLinks}
          className="w-full rounded-md border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {savingLinks ? "Saving..." : "Save Social Links"}
        </button>
      </form>

      {linksMessage ? <p className="mt-3 text-sm text-slate-600">{linksMessage}</p> : null}
    </div>
  );
}
