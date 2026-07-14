import { z } from "zod";

import { DEFAULT_ADDRESS_COUNTRY } from "@/lib/constants";

const booleanFromInputSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return value;
}, z.boolean());

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).optional(),
    confirmPassword: z.string().optional()
  })
  .refine((data) => {
    if (!data.newPassword && !data.currentPassword && !data.confirmPassword) {
      return true;
    }
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    if (!data.newPassword && data.currentPassword) {
      return false;
    }
    return data.newPassword === data.confirmPassword;
  }, "Password change fields are invalid.");

export const profileSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).optional(),
    confirmPassword: z.string().optional()
  })
  .refine((data) => {
    if (data.newPassword && !data.currentPassword) return false;
    if (data.newPassword !== data.confirmPassword) return false;
    return true;
  }, "Profile update is invalid.");

export const addressSchema = z.object({
  name: z.string().trim().min(1).max(100),
  line1: z.string().trim().min(1).max(120),
  line2: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().min(1).max(80),
  state: z.string().trim().min(1).max(80),
  zip: z.string().trim().min(1).max(20),
  country: z.string().trim().min(2).max(80).default(DEFAULT_ADDRESS_COUNTRY),
  isDefault: booleanFromInputSchema.optional().default(false)
});

export const wishlistMutationSchema = z.object({
  productId: z.string().trim().min(1)
});
