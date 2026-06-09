"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ImageUploader } from "@/components/admin/image-uploader";
import { useAdminRefreshTransition } from "@/hooks/use-admin-refresh-transition";

interface LookbookPanelProduct {
  id: string;
  name: string;
  slug: string;
}

interface LookbookPanelEntry {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  order: number;
  active: boolean;
  productId: string | null;
  product: LookbookPanelProduct | null;
}

interface LookbookPanelProps {
  entries: LookbookPanelEntry[];
  products: LookbookPanelProduct[];
}

function reorderItems<T>(items: T[], sourceIndex: number, targetIndex: number) {
  const next = [...items];
  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}

export function LookbookPanel({ entries, products }: LookbookPanelProps) {
  const [items, setItems] = useState(entries);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [linkedProductId, setLinkedProductId] = useState<string>("");
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingEntryId, setPendingEntryId] = useState<string | null>(null);
  const [pendingEntryAction, setPendingEntryAction] = useState<
    "toggle" | "delete" | "restore" | null
  >(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const { isPending, refresh } = useAdminRefreshTransition();

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.order - b.order),
    [items]
  );

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setImages([]);
    setLinkedProductId("");
    setActive(true);
    setOrder(sortedItems.length);
    setError(null);
  }

  function openCreateForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(entry: LookbookPanelEntry) {
    setEditingId(entry.id);
    setTitle(entry.title);
    setSubtitle(entry.subtitle ?? "");
    setImages([entry.imageUrl]);
    setLinkedProductId(entry.productId ?? "");
    setActive(entry.active);
    setOrder(entry.order);
    setError(null);
    setShowForm(true);
  }

  async function persistOrder(nextItems: LookbookPanelEntry[]) {
    await Promise.all(
      nextItems.map((entry, index) =>
        fetch(`/api/admin/lookbook/${entry.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: index })
        })
      )
    );
  }

  async function onDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const sourceIndex = sortedItems.findIndex((item) => item.id === draggedId);
    const targetIndex = sortedItems.findIndex((item) => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) {
      setDraggedId(null);
      return;
    }

    const reordered = reorderItems(sortedItems, sourceIndex, targetIndex).map(
      (entry, index) => ({
        ...entry,
        order: index
      })
    );
    setItems(reordered);
    setDraggedId(null);
    try {
      await persistOrder(reordered);
      toast.success("Lookbook order saved.");
      refresh();
    } catch (persistError) {
      console.error(persistError);
      setError("Unable to save order.");
      toast.error("Unable to save lookbook order.");
    }
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!images[0]) {
      setError("Please upload an image.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const endpoint = editingId
        ? `/api/admin/lookbook/${editingId}`
        : "/api/admin/lookbook";
      const method = editingId ? "PATCH" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim() ? subtitle.trim() : null,
          imageUrl: images[0],
          active,
          order: Number.isFinite(order) ? Math.max(0, Math.trunc(order)) : 0,
          productId: linkedProductId || null
        })
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Unable to save lookbook entry.");
        toast.error(json.error ?? "Unable to save lookbook entry.");
        return;
      }
      setShowForm(false);
      resetForm();
      toast.success(editingId ? "Lookbook entry updated." : "Lookbook entry created.");
      refresh();
    } catch (submitError) {
      console.error(submitError);
      setError("Unable to save lookbook entry.");
      toast.error("Unable to save lookbook entry.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntry(id: string) {
    const confirmed = window.confirm("Deactivate this lookbook entry?");
    if (!confirmed) return;
    setPendingEntryId(id);
    setPendingEntryAction("delete");
    try {
      const response = await fetch(`/api/admin/lookbook/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      toast.success("Lookbook entry deactivated.");
      refresh();
    } catch (deleteError) {
      console.error(deleteError);
      setError("Unable to delete lookbook entry.");
      toast.error("Unable to deactivate lookbook entry.");
    } finally {
      setPendingEntryId(null);
      setPendingEntryAction(null);
    }
  }

  async function restoreEntry(id: string) {
    setPendingEntryId(id);
    setPendingEntryAction("restore");
    try {
      const response = await fetch(`/api/admin/lookbook/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: true })
      });
      if (!response.ok) {
        throw new Error("Restore failed");
      }
      toast.success("Lookbook entry restored.");
      refresh();
    } catch (restoreError) {
      console.error(restoreError);
      setError("Unable to restore lookbook entry.");
      toast.error("Unable to restore lookbook entry.");
    } finally {
      setPendingEntryId(null);
      setPendingEntryAction(null);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#e2e4ed]">Lookbook</h1>
          <p className="text-sm text-[#6b7280]">Manage editorial lookbook frames</p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4f46e5]"
        >
          Add Entry
        </button>
      </header>

      {showForm ? (
        <form
          onSubmit={submitForm}
          className="space-y-4 rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2 text-sm md:col-span-2">
              <span className="text-[#9ca3af]">Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
              <span className="text-[#9ca3af]">Subtitle</span>
              <input
                value={subtitle}
                onChange={(event) => setSubtitle(event.target.value)}
                className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-[#9ca3af]">Linked product (optional)</span>
              <select
                value={linkedProductId}
                onChange={(event) => setLinkedProductId(event.target.value)}
                className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
              >
                <option value="">No linked product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-[#9ca3af]">Order</span>
              <input
                type="number"
                min={0}
                value={order}
                onChange={(event) => setOrder(Number(event.target.value))}
                className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
              />
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-[#9ca3af] md:col-span-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(event) => setActive(event.target.checked)}
                className="accent-[#6366f1]"
              />
              Active
            </label>
            <div className="md:col-span-2">
              <p className="mb-2 text-sm text-[#9ca3af]">Image</p>
              <ImageUploader value={images} onChange={setImages} maxImages={1} />
            </div>
          </div>

          {error ? <p className="text-sm text-[#fca5a5]">{error}</p> : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || isPending}
              className="rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4f46e5] disabled:opacity-60"
            >
              {saving || isPending ? "Saving..." : editingId ? "Update Entry" : "Create Entry"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="rounded-md border border-[#2a2d3a] px-4 py-2 text-sm text-[#9ca3af] transition hover:border-[#6366f1] hover:text-[#e2e4ed]"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <section className="space-y-2">
        {sortedItems.map((entry) => (
          <article
            key={entry.id}
            draggable
            onDragStart={() => setDraggedId(entry.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => void onDrop(entry.id)}
            className={`grid gap-3 rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-3 md:grid-cols-[auto_1fr_auto] ${
              entry.active ? "" : "opacity-60"
            }`}
          >
            <button
              type="button"
              className="cursor-grab text-[#6b7280] hover:text-[#e2e4ed]"
              aria-label="Reorder lookbook entry"
            >
              <GripVertical size={16} />
            </button>
            <div className="flex gap-3">
              <div className="relative h-14 w-16 overflow-hidden rounded border border-[#2a2d3a] bg-[#0f1117]">
                <Image
                  src={entry.imageUrl}
                  alt={entry.title}
                  fill
                  unoptimized
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-[#e2e4ed]">{entry.title}</p>
                <p className="text-xs text-[#6b7280]">{entry.subtitle ?? "No subtitle"}</p>
                <p className="text-xs text-[#9ca3af]">
                  {entry.product ? `Linked: ${entry.product.name}` : "No linked product"} ·
                  Order {entry.order}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                  entry.active
                    ? "bg-[#22c55e]/20 text-[#86efac]"
                    : "bg-[#6b7280]/20 text-[#d1d5db]"
                }`}
                onClick={async () => {
                  setPendingEntryId(entry.id);
                  setPendingEntryAction("toggle");
                  try {
                    const response = await fetch(`/api/admin/lookbook/${entry.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ active: !entry.active })
                    });
                    if (!response.ok) {
                      throw new Error("Toggle failed");
                    }
                    toast.success(`Lookbook entry ${entry.active ? "deactivated" : "activated"}.`);
                    refresh();
                  } catch (toggleError) {
                    console.error(toggleError);
                    toast.error("Unable to update lookbook entry status.");
                  } finally {
                    setPendingEntryId(null);
                    setPendingEntryAction(null);
                  }
                }}
                disabled={isPending || (pendingEntryId === entry.id && pendingEntryAction === "toggle")}
              >
                {pendingEntryId === entry.id && pendingEntryAction === "toggle"
                  ? "Saving..."
                  : entry.active
                    ? "Active"
                    : "Inactive"}
              </button>
              <button
                type="button"
                onClick={() => openEditForm(entry)}
                className="text-[#a5b4fc] hover:text-[#c7d2fe]"
                aria-label="Edit lookbook entry"
              >
                <Pencil size={15} />
              </button>
              {entry.active ? (
                <button
                  type="button"
                  onClick={() => void deleteEntry(entry.id)}
                  disabled={isPending || (pendingEntryId === entry.id && pendingEntryAction === "delete")}
                  className="text-[#fca5a5] hover:text-[#ef4444]"
                  aria-label="Delete lookbook entry"
                >
                  {pendingEntryId === entry.id && pendingEntryAction === "delete" ? (
                    <span className="text-[11px] font-medium">Deleting...</span>
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void restoreEntry(entry.id)}
                  disabled={isPending || (pendingEntryId === entry.id && pendingEntryAction === "restore")}
                  className="text-[11px] font-medium uppercase tracking-wide text-[#86efac] transition hover:text-[#22c55e]"
                >
                  {pendingEntryId === entry.id && pendingEntryAction === "restore"
                    ? "Restoring..."
                    : "Restore"}
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
