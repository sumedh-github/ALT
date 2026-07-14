import type { Prisma } from "@prisma/client";

import type { AltProduct } from "@/lib/mock-data";

export type DBProduct = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    category: true;
  };
}>;

export type StorefrontProduct = AltProduct | DBProduct;
