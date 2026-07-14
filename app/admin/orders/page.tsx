import Link from "next/link";
import type { OrderStatus, Prisma } from "@prisma/client";

import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface OrdersPageProps {
  searchParams?: {
    q?: string;
    status?: string;
  };
}

const statusOptions: Array<OrderStatus | "ALL"> = [
  "ALL",
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED"
];

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const query = searchParams?.q ?? "";
  const status = searchParams?.status ?? "ALL";

  const where: Prisma.OrderWhereInput = {
    ...(status !== "ALL" ? { status: status as OrderStatus } : {}),
    ...(query
      ? {
          OR: [
            { id: { contains: query, mode: "insensitive" } },
            {
              user: {
                email: {
                  contains: query,
                  mode: "insensitive"
                }
              }
            }
          ]
        }
      : {})
  };

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      items: {
        select: { id: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#e2e4ed]">Orders</h1>
        <p className="text-sm text-[#6b7280]">{orders.length} matching orders</p>
      </header>

      <form className="grid gap-3 rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-4 md:grid-cols-[1fr_220px_auto]">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search by order ID or customer email"
          className="h-10 rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-sm text-[#e2e4ed] placeholder:text-[#6b7280] focus:border-[#6366f1] focus:outline-none"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-10 rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-sm text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 rounded-md bg-[#6366f1] px-4 text-sm font-medium text-white transition hover:bg-[#4f46e5]"
        >
          Filter
        </button>
      </form>

      <section className="overflow-hidden rounded-lg border border-[#2a2d3a] bg-[#1a1d27]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3a] text-xs uppercase tracking-wide text-[#6b7280]">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#2a2d3a]/70">
                  <td className="px-4 py-3 font-medium text-[#e2e4ed]">#{order.id.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-[#9ca3af]">{order.user.name ?? order.user.email}</td>
                  <td className="px-4 py-3 text-[#9ca3af]">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric"
                    }).format(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af]">{order.items.length}</td>
                  <td className="px-4 py-3 text-[#e2e4ed]">{formatCurrency(order.total / 100)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-[#a5b4fc] transition hover:text-[#c7d2fe]"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[#6b7280]">No orders found.</p>
        ) : null}
      </section>
    </div>
  );
}
