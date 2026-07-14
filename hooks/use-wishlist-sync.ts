"use client";

import { useEffect, useRef, useState } from "react";

import { normalizeWishlistApiItems } from "@/lib/wishlist";
import { useWishlistStore } from "@/store/wishlist-store";

type WishlistSyncStatus = "authenticated" | "loading" | "unauthenticated";

export function useWishlistSync(userId: string | undefined, status: WishlistSyncStatus) {
  const [hasSynced, setHasSynced] = useState(false);
  const mergeItems = useWishlistStore((state) => state.mergeItems);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const previousUserIdRef = useRef<string | undefined>(userId);

  useEffect(() => {
    if (userId !== previousUserIdRef.current) {
      setHasSynced(false);
      previousUserIdRef.current = userId;
    }
  }, [userId]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setHasSynced(false);
      clearWishlist();
      previousUserIdRef.current = undefined;
    }
  }, [status, clearWishlist]);

  useEffect(() => {
    if (status !== "authenticated" || !userId || hasSynced) {
      return;
    }

    let active = true;

    async function syncWishlist() {
      try {
        const response = await fetch("/api/account/wishlist", {
          method: "GET",
          cache: "no-store"
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        const remoteItems = normalizeWishlistApiItems(payload);
        if (!active) {
          return;
        }

        mergeItems(remoteItems);
      } catch (error) {
        console.error(error);
      } finally {
        if (active) {
          setHasSynced(true);
        }
      }
    }

    void syncWishlist();

    return () => {
      active = false;
    };
  }, [status, userId, hasSynced, mergeItems]);
}
