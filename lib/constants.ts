import type { OrderStatus } from "@prisma/client";

export const ORDER_STATUS_VALUES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED"
];

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  PENDING: "bg-[#f59e0b]/20 text-[#fbbf24]",
  PROCESSING: "bg-[#3b82f6]/20 text-[#93c5fd]",
  SHIPPED: "bg-[#6366f1]/20 text-[#a5b4fc]",
  DELIVERED: "bg-[#22c55e]/20 text-[#86efac]",
  CANCELLED: "bg-[#ef4444]/20 text-[#fca5a5]",
  REFUNDED: "bg-[#6b7280]/20 text-[#d1d5db]"
};

export const ACCOUNT_SECTION_KEYS = [
  "profile",
  "orders",
  "addresses",
  "wishlist",
  "danger"
] as const;

export const ACCOUNT_DELETE_CONFIRM_VALUE = "DELETE";
export const DEFAULT_ADDRESS_COUNTRY = "US";

export const ACCOUNT_API_PATHS = {
  profile: "/api/account/profile",
  addresses: "/api/account/addresses",
  wishlist: "/api/account/wishlist",
  delete: "/api/account/delete"
} as const;
