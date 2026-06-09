import Link from "next/link";
import { redirect } from "next/navigation";

import { AccountSignOutButton } from "@/app/account/account-sign-out-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

const statusClasses: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-200",
  PROCESSING: "bg-blue-500/15 text-blue-200",
  SHIPPED: "bg-indigo-500/15 text-indigo-200",
  DELIVERED: "bg-emerald-500/15 text-emerald-200",
  CANCELLED: "bg-red-500/15 text-red-200",
  REFUNDED: "bg-zinc-500/15 text-zinc-200"
};

export default async function AccountPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-10 pb-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.86] text-text">
            MY THEORY
          </p>
          <AccountSignOutButton />
        </div>
        <p className="font-body text-sm text-muted">
          {session.user.name ?? "Unnamed"} · {session.user.email}
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-4xl leading-none text-text">Order History</h2>
        {orders.length === 0 ? (
          <div className="space-y-3 rounded-sm border border-surface bg-surface/20 p-6">
            <p className="font-display text-3xl italic text-text">No theories claimed yet.</p>
            <Link
              href="/shop"
              className="font-body text-xs uppercase tracking-[0.24em] text-gold transition hover:text-taupe"
            >
              Enter Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-sm border border-surface bg-surface/30 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-muted">
                      {order.id}
                    </p>
                    <p className="font-body text-sm text-taupe">
                      {new Date(order.createdAt).toLocaleDateString("en-US")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 font-body text-[11px] uppercase tracking-[0.2em] ${
                      statusClasses[order.status] ?? "bg-surface text-text"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <p className="font-body text-sm text-muted">
                    Total: <span className="text-gold">${order.total}</span>
                  </p>
                  <p className="font-body text-sm text-muted">
                    Items: <span className="text-text">{order.items.length}</span>
                  </p>
                  <p className="font-body text-sm text-muted">
                    Status: <span className="text-text">{order.status}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-sm border border-surface bg-surface/20 p-6">
        <h2 className="font-display text-4xl leading-none text-text">Profile</h2>
        <div className="space-y-1">
          <p className="font-body text-sm text-muted">Name: {session.user.name ?? "N/A"}</p>
          <p className="font-body text-sm text-muted">Email: {session.user.email}</p>
        </div>
        <button
          type="button"
          className="border border-surface px-4 py-2 font-body text-xs uppercase tracking-[0.22em] text-text transition hover:border-gold hover:text-gold"
        >
          Edit Profile
        </button>
      </section>
    </div>
  );
}
