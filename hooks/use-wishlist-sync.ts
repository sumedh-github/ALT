"use client";

import type { SessionStatus } from "next-auth/react";
import { useEffect, useRef } from "react";

import { useWishlistStore } from "@/store/wishlist-store";

export function useWishlistSync(status: SessionStatus) {
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
