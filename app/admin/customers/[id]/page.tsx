import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CustomerDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AdminCustomerDetailPage({ params }: CustomerDetailPageProps) {
  const customer = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      orders: {
        include: {
          items: {
            select: { id: true }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!customer) {
    notFound();
  }

  const totalSpend = customer.orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      <header className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5">
        <h1 className="text-2xl font-semibold text-[#e2e4ed]">{customer.name ?? "Unnamed"}</h1>
        <p className="text-sm text-[#9ca3af]">{customer.email}</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-[#6b7280]">
          {customer.orders.length} orders · {formatCurrency(totalSpend / 100)} lifetime spend
        </p>
      </header>

      <section className="overflow-hidden rounded-lg border border-[#2a2d3a] bg-[#1a1d27]">
        <div className="border-b border-[#2a2d3a] px-4 py-3">
          <h2 className="text-sm font-semibold text-[#e2e4ed]">Order History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3a] text-xs uppercase tracking-wide text-[#6b7280]">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.map((order) => (
                <tr key={order.id} className="border-b border-[#2a2d3a]/70">
                  <td className="px-4 py-3 font-medium text-[#e2e4ed]">#{order.id.slice(0, 10)}</td>
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
      </section>
    </div>
  );
}
