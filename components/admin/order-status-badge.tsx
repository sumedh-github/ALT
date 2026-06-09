import type { OrderStatus } from "@prisma/client";

import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusClasses: Record<OrderStatus, string> = {
  PENDING: "bg-[#f59e0b]/20 text-[#fbbf24]",
  PROCESSING: "bg-[#3b82f6]/20 text-[#93c5fd]",
  SHIPPED: "bg-[#6366f1]/20 text-[#a5b4fc]",
  DELIVERED: "bg-[#22c55e]/20 text-[#86efac]",
  CANCELLED: "bg-[#ef4444]/20 text-[#fca5a5]",
  REFUNDED: "bg-[#6b7280]/20 text-[#d1d5db]"
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
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
