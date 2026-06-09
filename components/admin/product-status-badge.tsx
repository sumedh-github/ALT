import type { ProductStatus } from "@prisma/client";

import { cn } from "@/lib/utils";

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

const statusClasses: Record<ProductStatus, string> = {
  DRAFT: "bg-[#6b7280]/20 text-[#d1d5db]",
  ACTIVE: "bg-[#22c55e]/20 text-[#86efac]",
  DELETED: "bg-[#ef4444]/20 text-[#fca5a5]"
};

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-[11px] font-medium uppercase tracking-wide",
        statusClasses[status]
      )}
    >
      {status}
    </span>
  );
}
