"use client";

import type { ProductStatus } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ProductRowActionsProps {
  productId: string;
  status: ProductStatus;
}

export function ProductRowActions({ productId, status }: ProductRowActionsProps) {
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
    const shouldDelete = window.confirm(
      "Soft delete this product? It will be marked as DELETED."
    );
    if (!shouldDelete) {
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      toast.success("Product deleted.");
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete product right now.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleRestore() {
    setRestoring(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE" })
      });
      if (!response.ok) {
        throw new Error("Failed to restore product");
      }
      toast.success("Product restored.");
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Unable to restore product right now.");
    } finally {
      setRestoring(false);
    }
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      <Link
        href={`/admin/products/${productId}/edit`}
        className="text-[#a5b4fc] transition hover:text-[#c7d2fe]"
      >
        Edit
      </Link>
      {status === "DELETED" ? (
        <button
          type="button"
          onClick={handleRestore}
          disabled={restoring || isPending}
          className="text-[#86efac] transition hover:text-[#22c55e] disabled:opacity-60"
        >
          {restoring || isPending ? "Restoring..." : "Restore"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting || isPending}
          className="text-[#fca5a5] transition hover:text-[#ef4444] disabled:opacity-60"
        >
          {deleting || isPending ? "Deleting..." : "Delete"}
        </button>
      )}
    </div>
  );
}
