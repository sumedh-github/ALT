import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/alt/sign-out-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Account | Avero Loose Theory"
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const orders = await prisma.order
    .findMany({
      where: { email: session.user.email ?? undefined },
      orderBy: { createdAt: "desc" },
      take: 5
    })
    .catch(() => []);

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-sm border border-surface bg-surface/20 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Client Profile</p>
        <h1 className="mt-2 font-display text-5xl leading-none">
          {session.user.name ?? "ALT Client"}
        </h1>
        <p className="mt-3 text-sm text-taupe">{session.user.email}</p>
        <div className="mt-5">
          <SignOutButton />
        </div>
      </div>

      <div className="rounded-sm border border-surface bg-surface/20 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Recent Orders</p>
        <div className="mt-4 space-y-3">
          {orders.length ? (
            orders.map((order) => (
              <article key={order.id} className="border-b border-surface pb-3">
                <p className="text-xs uppercase tracking-[0.2em] text-taupe">
                  {order.id.slice(0, 8)}
                </p>
                <p className="mt-1 text-sm text-gold">
                  ${(order.total / 100).toFixed(0)} - {order.status}
                </p>
              </article>
            ))
          ) : (
            <p className="text-sm text-taupe">No orders yet. Your first ALT drop awaits.</p>
          )}
        </div>
      </div>
    </div>
  );
}
