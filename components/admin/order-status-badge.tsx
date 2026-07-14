import type { OrderStatus } from "@prisma/client";

import { ORDER_STATUS_BADGE_CLASSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-[11px] font-medium uppercase tracking-wide",
        ORDER_STATUS_BADGE_CLASSES[status]
      )}
    >
      {status}
    </span>
  );
}
