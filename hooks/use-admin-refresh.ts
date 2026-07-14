"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function useAdminRefresh() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function refresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return { isPending, startTransition, refresh };
}
