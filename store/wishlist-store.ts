"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { WishlistItem } from "@/types";

type WishlistStore = {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const exists = state.items.some(
            (entry) => entry.productId === item.productId
          );
          if (exists) {
            return state;
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.productId !== productId)
        })),
      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.some(
            (entry) => entry.productId === item.productId
          );
          if (exists) {
            return {
              items: state.items.filter(
                (entry) => entry.productId !== item.productId
              )
            };
          }
          return { items: [...state.items, item] };
        }),
      isWishlisted: (productId) =>
        get().items.some((entry) => entry.productId === productId),
      clearWishlist: () => set({ items: [] })
    }),
    { name: "alt-wishlist" }
  )
);
