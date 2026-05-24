"use client";

import { useCartSummary } from "@/hooks/use-cart-summary";
import { formatCurrency } from "@/lib/utils";

export function CheckoutSummary() {
  const { items, subtotal, quantity } = useCartSummary();

  return (
    <aside className="rounded-sm border border-surface bg-surface/30 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Order Summary</p>
      <p className="mt-3 font-display text-4xl">{quantity}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-taupe">Items selected</p>
      <div className="mt-5 space-y-3 border-t border-surface pt-3">
        {items.length ? (
          items.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-taupe">
                {item.name} ({item.size}) x {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-taupe">Your selection is currently empty.</p>
        )}
      </div>
      <div className="mt-4 border-t border-surface pt-4 text-sm uppercase tracking-[0.2em]">
        <div className="flex items-center justify-between">
          <span className="text-muted">Subtotal</span>
          <span className="text-gold">{formatCurrency(subtotal)}</span>
        </div>
      </div>
    </aside>
  );
}
