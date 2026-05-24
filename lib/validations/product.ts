import { z } from "zod";

export const productInputSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(20),
  shortDescription: z.string().min(12),
  price: z.number().positive(),
  inventory: z.number().int().nonnegative(),
  featured: z.boolean().default(false),
  categoryId: z.string().cuid(),
  imageUrls: z.array(z.string().url()).min(1)
});
