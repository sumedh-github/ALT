"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { areWishlistItemsEqual, dedupeWishlistItems } from "@/lib/wishlist";
import type { WishlistItem } from "@/types";

type WishlistStore = {
  items: WishlistItem[];
  mergeItems: (items: WishlistItem[]) => void;
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
      mergeItems: (incomingItems) =>
        set((state) => {
          const merged = dedupeWishlistItems([...state.items, ...incomingItems]);
          if (areWishlistItemsEqual(state.items, merged)) {
            return state;
          }
          return { items: merged };
        }),
      addItem: (item) =>
        set((state) => {
          const exists = state.items.some(
            (entry) => entry.productId === item.productId
          );
        } catch (error) {
          if (error instanceof ApiRequestError && error.status === 401) {
            return;
          }
          console.error(error);
        }
      },
      addItem: async (item) => {
        const currentItems = get().items;
        if (currentItems.some((entry) => entry.productId === item.productId)) {
          return;
        }

        set({ items: [...currentItems, item] });

        try {
          await adminPost<WishlistApiResponse>(ACCOUNT_API_PATHS.wishlist, {
            productId: item.productId
          } satisfies WishlistMutationPayload);
        } catch (error) {
          if (error instanceof ApiRequestError && error.status === 401) {
            return;
          }
          console.error(error);
        }
      },
      removeItem: async (productId) => {
        set((state) => ({
          items: state.items.filter((entry) => entry.productId !== productId)
        }));

        try {
          await adminDelete(`${ACCOUNT_API_PATHS.wishlist}/${productId}`);
        } catch (error) {
          if (error instanceof ApiRequestError && error.status === 401) {
            return;
          }
          console.error(error);
        }
      },
      toggleItem: async (item) => {
        if (get().items.some((entry) => entry.productId === item.productId)) {
          await get().removeItem(item.productId);
          return;
        }
        await get().addItem(item);
      },
      clearAllItems: async () => {
        const currentItems = get().items;
        set({ items: [] });

        await Promise.all(
          currentItems.map((item) =>
            adminDelete(`${ACCOUNT_API_PATHS.wishlist}/${item.productId}`).catch((error) => {
              if (error instanceof ApiRequestError && error.status === 401) {
                return;
              }
              console.error(error);
            })
          )
        );
      },
      isWishlisted: (productId) =>
        get().items.some((entry) => entry.productId === productId),
      clearWishlist: () => set({ items: [] })
    }),
    { name: "alt-wishlist" }
  )
);
