import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Use a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be under 72 characters.")
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name is required."),
  confirmPassword: z.string().min(8, "Confirm your password.")
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Use a valid email address.")
});
