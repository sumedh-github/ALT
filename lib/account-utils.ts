import { ACCOUNT_DELETE_CONFIRM_VALUE } from "@/lib/constants";

export function splitName(fullName: string) {
  const normalized = fullName.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return { firstName: "ALT", lastName: "Member" };
  }

  const [firstName, ...rest] = normalized.split(" ");
  return {
    firstName,
    lastName: rest.join(" ") || "-"
  };
}

export function formatAddressName(firstName: string, lastName: string) {
  const combined = `${firstName} ${lastName}`.trim();
  return combined.replace(/\s+-$/, "").trim();
}

export function truncateOrderId(orderId: string) {
  return `#ORD-${orderId.slice(-6).toUpperCase()}`;
}

export function looksLikeTrackingUrl(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  return /^https?:\/\//i.test(value);
}

export function isDeleteAccountConfirmationValid(value: string) {
  return value.trim().toUpperCase() === ACCOUNT_DELETE_CONFIRM_VALUE;
}
