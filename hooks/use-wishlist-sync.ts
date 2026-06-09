"use client";

import { useEffect, useRef } from "react";

import { useWishlistStore } from "@/store/wishlist-store";

type WishlistSyncStatus = "authenticated" | "loading" | "unauthenticated";

export function useWishlistSync(status: WishlistSyncStatus) {
  const syncFromDatabase = useWishlistStore((state) => state.syncFromDatabase);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const previousStatusRef = useRef(status);

  useEffect(() => {
    if (status === "authenticated") {
      void syncFromDatabase();
    }

    if (previousStatusRef.current === "authenticated" && status === "unauthenticated") {
      clearWishlist();
    }

    previousStatusRef.current = status;
  }, [status, syncFromDatabase, clearWishlist]);
}
