"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

import { AltButton } from "@/components/alt/alt-button";
import { useCartSummary } from "@/hooks/use-cart-summary";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";

export function CartDrawer() {
  const { items, subtotal } = useCartSummary();
  const cartOpen = useUiStore((state) => state.cartOpen);
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <AnimatePresence>
      {cartOpen ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-40 bg-black/60"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ ease: "easeOut", duration: 0.35 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-surface bg-bg p-5"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-3xl">Cart</h2>
              <button
                type="button"
                aria-label="Close cart"
                className="rounded-sm border border-taupe/30 p-2 text-taupe transition hover:border-gold hover:text-gold"
                onClick={() => setCartOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
              {items.length ? (
                items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="border-b border-surface pb-3"
                  >
                    <p className="font-display text-xl">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      {item.size} x {item.quantity}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-gold">{formatCurrency(item.price * item.quantity)}</p>
                      <button
                        type="button"
                        className="text-xs uppercase tracking-[0.15em] text-taupe transition hover:text-gold"
                        onClick={() => removeItem(item.productId, item.size)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-taupe">
                  No pieces selected yet. Build your oversized silhouette.
                </p>
              )}
            </div>

            <div className="mt-6 border-t border-surface pt-4">
              <div className="mb-4 flex items-center justify-between text-sm uppercase tracking-[0.2em]">
                <span className="text-taupe">Subtotal</span>
                <span className="text-gold">{formatCurrency(subtotal)}</span>
              </div>
              <Link href="/cart" onClick={() => setCartOpen(false)}>
                <AltButton className="w-full">View Cart</AltButton>
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
