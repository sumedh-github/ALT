"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { adminDelete, adminGet, adminPost, ApiRequestError } from "@/lib/admin-fetch";
import { ACCOUNT_API_PATHS } from "@/lib/constants";
import {
  dedupeWishlistItems,
  toWishlistItemFromApiItem,
  type WishlistApiResponse,
  type WishlistMutationPayload
} from "@/lib/wishlist";
import type { WishlistItem } from "@/types";

type WishlistStore = {
  items: WishlistItem[];
  setItems: (items: WishlistItem[]) => void;
  syncFromDatabase: () => Promise<void>;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  toggleItem: (item: WishlistItem) => Promise<void>;
  clearAllItems: () => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => {
        set({ items: dedupeWishlistItems(items) });
      },
      syncFromDatabase: async () => {
        try {
          const response = await adminGet<WishlistApiResponse>(ACCOUNT_API_PATHS.wishlist);
          const remoteItems = response.items.map(toWishlistItemFromApiItem);
          const localItems = get().items;
          const mergedItems = dedupeWishlistItems([...localItems, ...remoteItems]);
          set({ items: mergedItems });

          const remoteIds = new Set(remoteItems.map((item) => item.productId));
          const missingLocalItems = localItems.filter((item) => !remoteIds.has(item.productId));
          if (!missingLocalItems.length) {
            return;
          }

          await Promise.all(
            missingLocalItems.map((item) =>
              adminPost<WishlistApiResponse>(ACCOUNT_API_PATHS.wishlist, {
                productId: item.productId
              } satisfies WishlistMutationPayload).catch((error) => {
                console.error(error);
              })
            )
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
