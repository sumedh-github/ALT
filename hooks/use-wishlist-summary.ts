"use client";

import { useMemo } from "react";

import { useWishlistStore } from "@/store/wishlist-store";

export function useWishlistSummary() {
  const items = useWishlistStore((state) => state.items);

  return useMemo(() => {
    return {
      items,
      count: items.length
    };
  }, [items]);
}
