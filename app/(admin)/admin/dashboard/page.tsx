import { redirect } from "next/navigation";

import { MetricCard } from "@/components/admin/metric-card";
import { OrdersTable } from "@/components/admin/orders-table";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin Dashboard | Avero Loose Theory"
};

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [orderCount, productCount, revenue, orders] = await Promise.all([
    prisma.order.count().catch(() => 0),
    prisma.product.count().catch(() => 0),
    prisma.order
      .aggregate({ _sum: { total: true } })
      .then((result) => result._sum.total ?? 0)
      .catch(() => 0),
    prisma.order
      .findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, email: true, status: true, total: true }
      })
      .catch(() => [])
  ]);

  return (
    <div className="space-y-8 pb-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-taupe">Admin</p>
        <h1 className="mt-2 font-display text-5xl">ALT Control Room</h1>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Orders" value={orderCount.toString()} helper="Total processed" />
        <MetricCard label="Products" value={productCount.toString()} helper="Active catalogue" />
        <MetricCard
          label="Revenue"
          value={`$${(revenue / 100).toFixed(0)}`}
          helper="Gross sales volume"
        />
      </section>

      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Latest Orders</p>
        <OrdersTable orders={orders} />
      </section>
    </div>
  );
}
