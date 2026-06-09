"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductRowActionsProps {
  productId: string;
}

export function ProductRowActions({ productId }: ProductRowActionsProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

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
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Unable to delete product right now.");
    } finally {
      setDeleting(false);
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
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="text-[#fca5a5] transition hover:text-[#ef4444] disabled:opacity-60"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
