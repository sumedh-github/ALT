import { getProductCategoryName, getProductDisplayPrice } from "@/lib/storefront-products";
import type { WishlistItem } from "@/types";
import type { DBProduct, StorefrontProduct } from "@/types/product";

export interface WishlistApiItem {
  id: string;
  productId: string;
  product: DBProduct;
}

export interface WishlistApiResponse {
  items: WishlistApiItem[];
}

export interface WishlistMutationPayload {
  productId: string;
}

export function toWishlistItem(product: StorefrontProduct): WishlistItem {
  return {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: getProductDisplayPrice(product),
    image: product.images[0]?.url ?? "",
    category: getProductCategoryName(product)
  };
}

export function toWishlistItemFromApiItem(item: WishlistApiItem): WishlistItem {
  return toWishlistItem(item.product);
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
