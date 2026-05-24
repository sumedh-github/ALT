"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "@/types";

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (entry) =>
              entry.productId === item.productId && entry.size === item.size
          );
          if (!existing) {
            return { items: [...state.items, item] };
          }
          return {
            items: state.items.map((entry) =>
              entry.productId === item.productId && entry.size === item.size
                ? { ...entry, quantity: entry.quantity + item.quantity }
                : entry
            )
          };
        }),
      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter(
            (entry) => !(entry.productId === productId && entry.size === size)
          )
        })),
      updateQuantity: (productId, size, quantity) =>
        set((state) => ({
          items: state.items.map((entry) =>
            entry.productId === productId && entry.size === size
              ? { ...entry, quantity: Math.max(1, quantity) }
              : entry
          )
        })),
      clearCart: () => set({ items: [] })
    }),
    { name: "alt-cart" }
  )
);
