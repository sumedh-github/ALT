"use client";

import Link from "next/link";

import { AltButton } from "@/components/alt/alt-button";
import { useCartSummary } from "@/hooks/use-cart-summary";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function CartView() {
  const { items, subtotal } = useCartSummary();
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="space-y-4">
      {items.length ? (
        items.map((item) => (
          <article
            key={`${item.productId}-${item.size}`}
            className="rounded-sm border border-surface bg-surface/30 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display text-2xl">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  Size {item.size}
                </p>
              </div>
              <p className="text-gold">{formatCurrency(item.price * item.quantity)}</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                className="rounded-sm border border-surface px-2 py-1 hover:border-gold"
                onClick={() =>
                  updateQuantity(item.productId, item.size, item.quantity - 1)
                }
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                className="rounded-sm border border-surface px-2 py-1 hover:border-gold"
                onClick={() =>
                  updateQuantity(item.productId, item.size, item.quantity + 1)
                }
              >
                +
              </button>
              <button
                type="button"
                className="ml-3 text-xs uppercase tracking-[0.15em] text-taupe hover:text-gold"
                onClick={() => removeItem(item.productId, item.size)}
              >
                Remove
              </button>
            </div>
          </article>
        ))
      ) : (
        <p className="text-sm text-taupe">
          Your cart is empty. Shape your theory with a few heavy essentials.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between border-t border-surface pt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Subtotal: <span className="text-gold">{formatCurrency(subtotal)}</span>
        </p>
        <Link href="/checkout">
          <AltButton variant="gold">Checkout</AltButton>
        </Link>
      </div>
    </div>
  );
}
