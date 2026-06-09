"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface TheoryRowActionsProps {
  theoryId: string;
  active: boolean;
}

export function TheoryRowActions({ theoryId, active }: TheoryRowActionsProps) {
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function refreshData() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleDelete() {
    const confirmed = window.confirm("Deactivate this theory?");
    if (!confirmed) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/theories/${theoryId}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to delete theory");
      }
      toast.success("Theory deactivated.");
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Unable to deactivate theory.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleRestore() {
    setRestoring(true);
    try {
      const response = await fetch(`/api/admin/theories/${theoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: true })
      });
      if (!response.ok) {
        throw new Error("Failed to restore theory");
      }
      toast.success("Theory restored.");
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Unable to restore theory.");
    } finally {
      setRestoring(false);
    }
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      <Link
        href={`/admin/theories/${theoryId}/edit`}
        className="text-[#a5b4fc] transition hover:text-[#c7d2fe]"
      >
        Edit
      </Link>
      {active ? (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting || isPending}
          className="text-[#fca5a5] transition hover:text-[#ef4444] disabled:opacity-60"
        >
          {deleting || isPending ? "Deleting..." : "Delete"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleRestore}
          disabled={restoring || isPending}
          className="text-[#86efac] transition hover:text-[#22c55e] disabled:opacity-60"
        >
          {restoring || isPending ? "Restoring..." : "Restore"}
        </button>
      )}
    </div>
  );
}
