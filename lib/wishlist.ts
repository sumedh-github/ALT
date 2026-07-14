import type { WishlistItem } from "@/types";

interface WishlistApiProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  category?: {
    name?: string;
  } | null;
  images?: Array<{
    url?: string | null;
  }>;
}

interface WishlistApiEntry {
  productId?: string;
  product?: WishlistApiProduct;
  name?: string;
  slug?: string;
  price?: number;
  image?: string;
  category?: string;
}

function toWishlistItemFromProduct(product: WishlistApiProduct): WishlistItem {
  return {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: product.images?.[0]?.url ?? "",
    category: product.category?.name ?? undefined
  };
}

function toWishlistItemFromEntry(entry: WishlistApiEntry): WishlistItem | null {
  if (entry.product) {
    return toWishlistItemFromProduct(entry.product);
  }

  if (!entry.productId || !entry.name || !entry.slug || typeof entry.price !== "number") {
    return null;
  }

  return {
    productId: entry.productId,
    name: entry.name,
    slug: entry.slug,
    price: entry.price,
    image: entry.image ?? "",
    category: entry.category
  };
}

export function dedupeWishlistItems(items: WishlistItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.productId)) {
      return false;
    }
    seen.add(item.productId);
    return true;
  });
}

export function areWishlistItemsEqual(a: WishlistItem[], b: WishlistItem[]) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((item, index) => {
    const candidate = b[index];
    return (
      item.productId === candidate.productId &&
      item.name === candidate.name &&
      item.slug === candidate.slug &&
      item.price === candidate.price &&
      item.image === candidate.image &&
      item.category === candidate.category
    );
  });
}

export function normalizeWishlistApiItems(payload: unknown): WishlistItem[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const items = (payload as { items?: unknown }).items;
  if (!Array.isArray(items)) {
    return [];
  }

  return dedupeWishlistItems(
    items
      .map((item) => toWishlistItemFromEntry(item as WishlistApiEntry))
      .filter((item): item is WishlistItem => Boolean(item))
  );
}
