"use client";

import type { OrderStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

interface OrderStatusFormProps {
  orderId: string;
  initialStatus: OrderStatus;
}

const statusSequence: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

export function OrderStatusForm({ orderId, initialStatus }: OrderStatusFormProps) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function refreshData() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber, internalNotes })
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Unable to update order.");
        toast.error(json.error ?? "Unable to update order.");
        return;
      }
      toast.success("Order updated.");
      refreshData();
    } catch (submitError) {
      console.error(submitError);
      setError("Unable to update order.");
      toast.error("Unable to update order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5">
      <h2 className="text-sm font-semibold text-[#e2e4ed]">Order Management</h2>

      <label className="space-y-2 text-sm">
        <span className="text-[#9ca3af]">Status</span>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus)}
          className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
        >
          {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].map(
            (option) => (
              <option key={option} value={option}>
                {option}
              </option>
            )
          )}
        </select>
      </label>

      <label className="space-y-2 text-sm">
        <span className="text-[#9ca3af]">Tracking number</span>
        <input
          value={trackingNumber}
          onChange={(event) => setTrackingNumber(event.target.value)}
          placeholder="Tracking ID"
          className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] placeholder:text-[#6b7280] focus:border-[#6366f1] focus:outline-none"
        />
      </label>

      <div className="space-y-2">
        <p className="text-sm text-[#9ca3af]">Order timeline</p>
        <ol className="grid gap-2 md:grid-cols-4">
          {statusSequence.map((step) => {
            const reached = statusSequence.indexOf(step) <= statusSequence.indexOf(status);
            return (
              <li
                key={step}
                className={`rounded-md border px-2 py-2 text-center text-xs ${
                  reached
                    ? "border-[#6366f1] bg-[#6366f1]/15 text-[#c7d2fe]"
                    : "border-[#2a2d3a] bg-[#0f1117] text-[#6b7280]"
                }`}
              >
                {step}
              </li>
            );
          })}
        </ol>
      </div>

      <label className="space-y-2 text-sm">
        <span className="text-[#9ca3af]">Internal notes</span>
        <textarea
          value={internalNotes}
          onChange={(event) => setInternalNotes(event.target.value)}
          rows={4}
          className="w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 py-2 text-[#e2e4ed] placeholder:text-[#6b7280] focus:border-[#6366f1] focus:outline-none"
          placeholder="Log fulfillment or support notes"
        />
      </label>

      {error ? <p className="text-sm text-[#fca5a5]">{error}</p> : null}

      <button
        type="submit"
        disabled={saving || isPending}
        className="rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4f46e5] disabled:opacity-60"
      >
        {saving || isPending ? "Saving..." : "Save updates"}
      </button>
    </form>
  );
}
