import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
  size: z.string().min(1),
  price: z.number().positive(),
  image: z.string().url()
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart is empty."),
  email: z.string().email(),
  shippingName: z.string().min(2),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(2),
  shippingPostalCode: z.string().min(2),
  shippingCountry: z.string().min(2)
});
