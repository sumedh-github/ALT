"use client";

import { useAdminRefresh } from "@/hooks/use-admin-refresh";

export function useAdminRefreshTransition() {
  const { isPending, refresh } = useAdminRefresh();
  return { isPending, refresh };
}
