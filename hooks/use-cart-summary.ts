"use client";

import { useMemo } from "react";

import { useCartStore } from "@/store/cart-store";

export function useCartSummary() {
  const items = useCartStore((state) => state.items);

  return useMemo(() => {
    const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return { items, quantity, subtotal };
  }, [items]);
}
