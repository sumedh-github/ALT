import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      orders: {
        select: {
          id: true,
          total: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#e2e4ed]">Customers</h1>
        <p className="text-sm text-[#6b7280]">{customers.length} customer records</p>
      </header>

      <section className="overflow-hidden rounded-lg border border-[#2a2d3a] bg-[#1a1d27]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3a] text-xs uppercase tracking-wide text-[#6b7280]">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Total Orders</th>
                <th className="px-4 py-3">Total Spend</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const totalSpend = customer.orders.reduce((sum, order) => sum + order.total, 0);
                return (
                  <tr key={customer.id} className="border-b border-[#2a2d3a]/70">
                    <td className="px-4 py-3 text-[#e2e4ed]">{customer.name ?? "Unnamed"}</td>
                    <td className="px-4 py-3 text-[#9ca3af]">{customer.email}</td>
                    <td className="px-4 py-3 text-[#9ca3af]">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric"
                      }).format(customer.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-[#9ca3af]">{customer.orders.length}</td>
                    <td className="px-4 py-3 text-[#e2e4ed]">
                      {formatCurrency(totalSpend / 100)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="text-xs text-[#a5b4fc] transition hover:text-[#c7d2fe]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
