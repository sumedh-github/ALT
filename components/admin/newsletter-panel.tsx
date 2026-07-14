"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useAdminRefreshTransition } from "@/hooks/use-admin-refresh-transition";

interface NewsletterSubscriberRow {
  id: string;
  email: string;
  createdAt: Date;
}

interface NewsletterPanelProps {
  subscribers: NewsletterSubscriberRow[];
}

export function NewsletterPanel({ subscribers }: NewsletterPanelProps) {
  const { isPending, refresh } = useAdminRefreshTransition();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  async function deleteSubscriber(id: string) {
    const confirmed = window.confirm("Delete this subscriber?");
    if (!confirmed) return;
    setPendingDeleteId(id);
    try {
      const response = await fetch(`/api/admin/newsletter/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Unable to delete subscriber");
      }
      toast.success("Subscriber deleted.");
      refresh();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete subscriber.");
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border border-[#2a2d3a] bg-[#1a1d27]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#2a2d3a] text-xs uppercase tracking-wide text-[#6b7280]">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Subscribed</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-b border-[#2a2d3a]/70">
                <td className="px-4 py-3 text-[#e2e4ed]">{subscriber.email}</td>
                <td className="px-4 py-3 text-[#9ca3af]">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                  }).format(new Date(subscriber.createdAt))}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => void deleteSubscriber(subscriber.id)}
                    disabled={isPending || pendingDeleteId === subscriber.id}
                    className="text-xs text-[#fca5a5] transition hover:text-[#ef4444]"
                  >
                    {pendingDeleteId === subscriber.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!subscribers.length ? (
        <p className="px-4 py-8 text-center text-sm text-[#6b7280]">
          No newsletter subscribers yet.
        </p>
      ) : null}
    </section>
  );
}
