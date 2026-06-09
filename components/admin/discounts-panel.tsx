"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { useAdminRefreshTransition } from "@/hooks/use-admin-refresh-transition";

interface DiscountRow {
  id: string;
  code: string;
  percentageOff: number | null;
  amountOff: number | null;
  usesCount: number;
  maxUses: number | null;
  expiresAt: Date | null;
  active: boolean;
}

interface DiscountsPanelProps {
  discounts: DiscountRow[];
}

type DiscountType = "PERCENTAGE" | "FIXED";

function randomCode() {
  return `ALT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function DiscountsPanel({ discounts }: DiscountsPanelProps) {
  const { isPending, refresh } = useAdminRefreshTransition();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [type, setType] = useState<DiscountType>("PERCENTAGE");
  const [value, setValue] = useState(10);
  const [maxUses, setMaxUses] = useState<number | "">("");
  const [expiry, setExpiry] = useState("");
  const [active, setActive] = useState(true);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  async function createDiscount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          type,
          value,
          maxUses: maxUses === "" ? null : maxUses,
          expiresAt: expiry ? new Date(expiry).toISOString() : null,
          active
        })
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Unable to create discount.");
        return;
      }
      setShowForm(false);
      setCode("");
      setType("PERCENTAGE");
      setValue(10);
      setMaxUses("");
      setExpiry("");
      setActive(true);
      toast.success("Discount created.");
      refresh();
    } catch (submitError) {
      console.error(submitError);
      setError("Unable to create discount.");
      toast.error("Unable to create discount.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(discountId: string, nextActive: boolean) {
    setPendingToggleId(discountId);
    try {
      const response = await fetch(`/api/admin/discounts/${discountId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextActive })
      });
      if (!response.ok) {
        throw new Error("Unable to toggle discount state");
      }
      toast.success(`Discount ${nextActive ? "activated" : "deactivated"}.`);
      refresh();
    } catch (toggleError) {
      console.error(toggleError);
      toast.error("Unable to update discount.");
    } finally {
      setPendingToggleId(null);
    }
  }

  async function deleteDiscount(discountId: string) {
    const confirmed = window.confirm("Delete this discount code?");
    if (!confirmed) return;
    setPendingDeleteId(discountId);
    try {
      const response = await fetch(`/api/admin/discounts/${discountId}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Unable to delete discount");
      }
      toast.success("Discount deleted.");
      refresh();
    } catch (deleteError) {
      console.error(deleteError);
      toast.error("Unable to delete discount.");
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#e2e4ed]">Discounts</h1>
          <p className="text-sm text-[#6b7280]">{discounts.length} discount codes</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4f46e5]"
        >
          {showForm ? "Close" : "Add Discount"}
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={createDiscount}
          className="grid gap-3 rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-4 md:grid-cols-2"
        >
          <label className="space-y-2 text-sm">
            <span className="text-[#9ca3af]">Code</span>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                required
                className="h-10 flex-1 rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setCode(randomCode())}
                className="rounded-md border border-[#2a2d3a] px-3 text-xs text-[#a5b4fc]"
              >
                Generate
              </button>
            </div>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-[#9ca3af]">Type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as DiscountType)}
              className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
            >
              <option value="PERCENTAGE">PERCENTAGE</option>
              <option value="FIXED">FIXED</option>
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-[#9ca3af]">Value</span>
            <input
              type="number"
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
              min={1}
              required
              className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-[#9ca3af]">Max uses</span>
            <input
              type="number"
              value={maxUses}
              onChange={(event) => setMaxUses(event.target.value ? Number(event.target.value) : "")}
              min={1}
              className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-[#9ca3af]">Expiry</span>
            <input
              type="date"
              value={expiry}
              onChange={(event) => setExpiry(event.target.value)}
              className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-2 self-end text-sm text-[#9ca3af]">
            <input
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
              className="accent-[#6366f1]"
            />
            Active
          </label>
          {error ? <p className="text-sm text-[#fca5a5] md:col-span-2">{error}</p> : null}
          <button
            type="submit"
            disabled={saving || isPending}
            className="rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4f46e5] disabled:opacity-60 md:col-span-2 md:justify-self-start"
          >
            {saving || isPending ? "Saving..." : "Create Discount"}
          </button>
        </form>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-[#2a2d3a] bg-[#1a1d27]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3a] text-xs uppercase tracking-wide text-[#6b7280]">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Uses</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id} className="border-b border-[#2a2d3a]/70">
                  <td className="px-4 py-3 font-medium text-[#e2e4ed]">{discount.code}</td>
                  <td className="px-4 py-3 text-[#9ca3af]">
                    {discount.percentageOff ? "%" : "Flat"}
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af]">
                    {discount.percentageOff ? `${discount.percentageOff}%` : `$${(discount.amountOff ?? 0) / 100}`}
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af]">
                    {discount.usesCount}/{discount.maxUses ?? "∞"}
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af]">
                    {discount.expiresAt
                      ? new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric"
                        }).format(new Date(discount.expiresAt))
                      : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(discount.id, !discount.active)}
                      disabled={isPending || pendingToggleId === discount.id}
                      className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                        discount.active
                          ? "bg-[#22c55e]/20 text-[#86efac]"
                          : "bg-[#6b7280]/20 text-[#d1d5db]"
                      }`}
                    >
                      {pendingToggleId === discount.id
                        ? "Saving..."
                        : discount.active
                          ? "Active"
                          : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => deleteDiscount(discount.id)}
                      disabled={isPending || pendingDeleteId === discount.id}
                      className="text-xs text-[#fca5a5] transition hover:text-[#ef4444]"
                    >
                      {pendingDeleteId === discount.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
