import Link from "next/link";

import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(value);
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    deliveredRevenue,
    ordersToday,
    activeProducts,
    totalCustomers,
    recentOrders,
    lowStockProducts,
    topProductCounts
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: "DELIVERED" },
      _sum: { total: true }
    }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: todayStart
        }
      }
    }),
    prisma.product.count({
      where: { status: "ACTIVE" }
    }),
    prisma.user.count({
      where: { role: "CUSTOMER" }
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          select: { id: true }
        }
      }
    }),
    prisma.product.findMany({
      where: {
        status: "ACTIVE",
        variants: {
          some: { inventory: { lt: 5 } }
        }
      },
      select: {
        id: true,
        name: true,
        variants: {
          where: { inventory: { lt: 5 } },
          select: { id: true, size: true, inventory: true }
        }
      },
      take: 10
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        productId: { not: null }
      },
      _count: { id: true },
      orderBy: {
        _count: { id: "desc" }
      },
      take: 5
    })
  ]);

  const topProductIds = topProductCounts
    .map((item) => item.productId)
    .filter((id): id is string => Boolean(id));
  const topProductsRaw = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, price: true }
  });
  const topProductsMap = new Map(topProductsRaw.map((item) => [item.id, item]));
  const topProducts = topProductCounts
    .map((entry) => {
      if (!entry.productId) {
        return null;
      }
      const product = topProductsMap.get(entry.productId);
      if (!product) {
        return null;
      }
      return {
        ...product,
        orders: entry._count.id
      };
    })
    .filter((item): item is { id: string; name: string; price: number; orders: number } => Boolean(item));

  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(now);

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#e2e4ed]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#6b7280]">{todayLabel}</p>
        </div>
        <Link
          href="/admin/orders"
          className="rounded-md border border-[#2a2d3a] bg-[#1a1d27] px-3 py-2 text-xs font-medium text-[#e2e4ed] transition hover:border-[#6366f1]/60 hover:text-white"
        >
          View all orders
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-4">
          <p className="text-xs uppercase tracking-wide text-[#6b7280]">Total Revenue</p>
          <p className="mt-2 text-2xl font-semibold text-[#e2e4ed]">
            {formatCurrency((deliveredRevenue._sum.total ?? 0) / 100)}
          </p>
        </article>
        <article className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-4">
          <p className="text-xs uppercase tracking-wide text-[#6b7280]">Orders Today</p>
          <p className="mt-2 text-2xl font-semibold text-[#e2e4ed]">{ordersToday}</p>
        </article>
        <article className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-4">
          <p className="text-xs uppercase tracking-wide text-[#6b7280]">Active Products</p>
          <p className="mt-2 text-2xl font-semibold text-[#e2e4ed]">{activeProducts}</p>
        </article>
        <article className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-4">
          <p className="text-xs uppercase tracking-wide text-[#6b7280]">Total Customers</p>
          <p className="mt-2 text-2xl font-semibold text-[#e2e4ed]">{totalCustomers}</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] xl:col-span-2">
          <div className="border-b border-[#2a2d3a] px-4 py-3">
            <h2 className="text-sm font-semibold text-[#e2e4ed]">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#2a2d3a] text-xs uppercase tracking-wide text-[#6b7280]">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#2a2d3a]/70">
                    <td className="px-4 py-3 font-medium text-[#e2e4ed]">#{order.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-[#9ca3af]">
                      {order.user.name ?? order.user.email}
                    </td>
                    <td className="px-4 py-3 text-[#9ca3af]">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-[#9ca3af]">{order.items.length}</td>
                    <td className="px-4 py-3 text-[#e2e4ed]">{formatCurrency(order.total / 100)}</td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27]">
            <div className="border-b border-[#2a2d3a] px-4 py-3">
              <h2 className="text-sm font-semibold text-[#e2e4ed]">Low Stock Alert</h2>
            </div>
            <div className="space-y-2 px-4 py-3">
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-[#6b7280]">No low stock variants right now.</p>
              ) : (
                lowStockProducts.flatMap((product) =>
                  product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="rounded-md border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-3 py-2 text-xs"
                    >
                      <p className="font-medium text-[#fbbf24]">{product.name}</p>
                      <p className="text-[#d1d5db]">
                        Size {variant.size} · {variant.inventory} left
                      </p>
                    </div>
                  ))
                )
              )}
            </div>
          </article>

          <article className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27]">
            <div className="border-b border-[#2a2d3a] px-4 py-3">
              <h2 className="text-sm font-semibold text-[#e2e4ed]">Top Products</h2>
            </div>
            <div className="space-y-2 px-4 py-3">
              {topProducts.length === 0 ? (
                <p className="text-xs text-[#6b7280]">No product sales data available.</p>
              ) : (
                topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-md border border-[#2a2d3a] px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-[#e2e4ed]">{product.name}</p>
                      <p className="text-xs text-[#6b7280]">{formatCurrency(product.price / 100)}</p>
                    </div>
                    <p className="text-xs text-[#a5b4fc]">{product.orders} orders</p>
                  </div>
                ))
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
