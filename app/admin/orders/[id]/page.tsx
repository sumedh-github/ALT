import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusForm } from "@/components/admin/order-status-form";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      address: true,
      items: {
        include: {
          product: {
            select: {
              images: {
                select: { url: true },
                orderBy: { position: "asc" },
                take: 1
              }
            }
          }
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#e2e4ed]">Order #{order.id.slice(0, 10)}</h1>
          <p className="text-sm text-[#6b7280]">
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            }).format(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <article className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5">
            <h2 className="text-sm font-semibold text-[#e2e4ed]">Customer</h2>
            <p className="mt-2 text-sm text-[#9ca3af]">{order.user.name ?? "Unnamed customer"}</p>
            <p className="text-sm text-[#9ca3af]">{order.user.email}</p>
            <Link
              href={`/admin/customers/${order.user.id}`}
              className="mt-2 inline-flex text-xs text-[#a5b4fc] transition hover:text-[#c7d2fe]"
            >
              View customer profile
            </Link>
          </article>

          <article className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5">
            <h2 className="text-sm font-semibold text-[#e2e4ed]">Shipping Address</h2>
            {order.address ? (
              <div className="mt-2 space-y-1 text-sm text-[#9ca3af]">
                <p>
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>{order.address.line1}</p>
                {order.address.line2 ? <p>{order.address.line2}</p> : null}
                <p>
                  {order.address.city}, {order.address.state} {order.address.postalCode}
                </p>
                <p>{order.address.country}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-[#6b7280]">No shipping address on record.</p>
            )}
          </article>

          <article className="overflow-hidden rounded-lg border border-[#2a2d3a] bg-[#1a1d27]">
            <div className="border-b border-[#2a2d3a] px-4 py-3">
              <h2 className="text-sm font-semibold text-[#e2e4ed]">Line Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2a2d3a] text-xs uppercase tracking-wide text-[#6b7280]">
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Unit</th>
                    <th className="px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-[#2a2d3a]/70">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-10 overflow-hidden rounded border border-[#2a2d3a] bg-[#0f1117]">
                            {item.product?.images[0]?.url ? (
                              <Image
                                src={item.product.images[0].url}
                                alt={item.name}
                                fill
                                sizes="40px"
                                unoptimized
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <span className="text-[#e2e4ed]">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#9ca3af]">{item.size ?? "—"}</td>
                      <td className="px-4 py-3 text-[#9ca3af]">{item.quantity}</td>
                      <td className="px-4 py-3 text-[#9ca3af]">{formatCurrency(item.unitPrice / 100)}</td>
                      <td className="px-4 py-3 text-[#e2e4ed]">
                        {formatCurrency((item.unitPrice * item.quantity) / 100)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <OrderStatusForm orderId={order.id} initialStatus={order.status} />

          <article className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5">
            <h2 className="text-sm font-semibold text-[#e2e4ed]">Order Totals</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-[#9ca3af]">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal / 100)}</span>
              </div>
              <div className="flex justify-between text-[#9ca3af]">
                <span>Shipping</span>
                <span>{formatCurrency(order.shippingTotal / 100)}</span>
              </div>
              <div className="flex justify-between text-[#9ca3af]">
                <span>Discount</span>
                <span>-{formatCurrency(order.discountTotal / 100)}</span>
              </div>
              <div className="border-t border-[#2a2d3a] pt-2 text-base font-semibold text-[#e2e4ed]">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{formatCurrency(order.total / 100)}</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
