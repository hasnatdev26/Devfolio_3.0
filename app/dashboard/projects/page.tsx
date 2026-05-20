 "use client";

import { type DragEvent, type FormEvent, type TouchEvent, useEffect, useState } from "react";

type ProjectItem = {
  _id: string;
  imageUrl: string;
  liveUrl: string;
  order?: number;
};

type ProjectForm = {
  imageUrl: string;
  liveUrl: string;
};

const initialForm: ProjectForm = {
  imageUrl: "",
  liveUrl: "",
};

export default function DashboardProjectsPage() {
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data?.ok && Array.isArray(data?.data)) {
        setProjects(data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data?.ok) {
        setMessage("Project added successfully.");
        setForm(initialForm);
        await loadProjects();
      } else {
        setMessage(data?.message || "Failed to add project.");
      }
    } catch {
      setMessage("Failed to add project.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data?.ok) {
        setProjects((prev) => prev.filter((item) => item._id !== id));
      }
    } catch {
      // no-op
    }
  };

  const onUploadImage = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result?.ok && result?.imageUrl) {
        setForm((prev) => ({ ...prev, imageUrl: result.imageUrl }));
        setMessage("Image uploaded. Now add live link and submit.");
      } else {
        setMessage(result?.message || "Image upload failed.");
      }
    } catch {
      setMessage("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const persistProjectOrder = async (items: ProjectItem[]) => {
    try {
      const orderedIds = items.map((item) => item._id);
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      const data = await res.json();
      if (!data?.ok) {
        throw new Error(data?.message || "Failed to update order.");
      }
      setMessage("Project order updated.");
    } catch {
      setMessage("Failed to update project order.");
      await loadProjects();
    }
  };

  const onDragStart = (id: string) => {
    setDraggingId(id);
    setDropTargetId(id);
  };

  const reorderProjects = async (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;

    const draggedIndex = projects.findIndex((item) => item._id === sourceId);
    const targetIndex = projects.findIndex((item) => item._id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const updated = [...projects];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);
    setProjects(updated);
    await persistProjectOrder(updated);
  };

  const onDropItem = async (targetId: string) => {
    if (!draggingId) return;
    await reorderProjects(draggingId, targetId);
    setDraggingId(null);
    setDropTargetId(null);
  };

  const onTouchMoveItem = (e: TouchEvent<HTMLDivElement>) => {
    if (!draggingId) return;
    const touch = e.touches[0];
    if (!touch) return;

    const hoveredElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetCard = hoveredElement?.closest("[data-project-id]") as HTMLElement | null;
    const targetId = targetCard?.dataset.projectId ?? null;
    if (targetId) {
      setDropTargetId(targetId);
    }
  };

  const onTouchEndItem = async () => {
    if (!draggingId) return;
    const targetId = dropTargetId ?? draggingId;
    await reorderProjects(draggingId, targetId);
    setDraggingId(null);
    setDropTargetId(null);
  };

  const onTouchStartItem = (id: string) => {
    setDraggingId(id);
    setDropTargetId(id);
  };

  const onTouchCancelItem = () => {
    setDraggingId(null);
    setDropTargetId(null);
  };

  const onDragOverItem = (e: DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (draggingId) {
      setDropTargetId(targetId);
    }
  };

  const onDragEndItem = () => {
    setDraggingId(null);
    setDropTargetId(null);
  };

  const onDeleteClick = async (id: string) => {
    await onDelete(id);
    if (draggingId === id) {
      setDraggingId(null);
      setDropTargetId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Projects</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Project Management</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Add new projects with image and live link directly from dashboard.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input
            type="hidden"
            value={form.imageUrl}
            readOnly
          />
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Upload Project Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onUploadImage(e.target.files?.[0] || null)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-md file:border-0 file:bg-violet-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-violet-700"
              disabled={uploading}
            />
            {uploading ? <p className="text-xs text-slate-500">Uploading image...</p> : null}
            {form.imageUrl ? (
              <p className="text-xs text-emerald-600">Image uploaded successfully.</p>
            ) : (
              <p className="text-xs text-slate-500">Please upload an image before adding project.</p>
            )}
          </div>
          <input
            type="url"
            placeholder="Project live link"
            value={form.liveUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, liveUrl: e.target.value }))}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900"
            required
          />
          <button
            type="submit"
            disabled={saving || !form.imageUrl}
            className="w-full rounded-md border border-violet-400/60 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-violet-700 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving ? "Adding..." : "Add Project"}
          </button>
        </form>
        {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Added Projects</h2>
        <p className="mt-2 text-xs text-slate-500">Desktop: drag and drop. Mobile: press and drag card to reorder. First item will show first on Projects page.</p>
        {loading ? <p className="mt-4 text-sm text-slate-600">Loading projects...</p> : null}
        {!loading && !projects.length ? (
          <p className="mt-4 text-sm text-slate-600">No projects added yet.</p>
        ) : null}
        <div className="mt-4 space-y-3 sm:space-y-4">
          {projects.map((project) => (
            <div
              key={project._id}
              data-project-id={project._id}
              draggable
              onDragStart={() => onDragStart(project._id)}
              onDragOver={(e) => onDragOverItem(e, project._id)}
              onDrop={() => onDropItem(project._id)}
              onDragEnd={onDragEndItem}
              onTouchStart={() => onTouchStartItem(project._id)}
              onTouchMove={onTouchMoveItem}
              onTouchEnd={onTouchEndItem}
              onTouchCancel={onTouchCancelItem}
              className={`rounded-xl border p-4 transition ${dropTargetId === project._id ? "border-violet-500 bg-violet-50" : "border-slate-200"}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-violet-700">Drag to reorder</p>
              <p className="break-all text-xs text-slate-500">Image: {project.imageUrl}</p>
              <p className="mt-1 break-all text-xs text-slate-500">Live: {project.liveUrl}</p>
              <button
                type="button"
                onClick={() => onDeleteClick(project._id)}
                className="mt-3 rounded-md border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
