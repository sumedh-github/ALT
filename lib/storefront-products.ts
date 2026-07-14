import { altCategories } from "@/lib/mock-data";
import type { DBProduct, StorefrontProduct } from "@/types/product";

const fallbackSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export function isDBProduct(product: StorefrontProduct): product is DBProduct {
  return "category" in product && "variants" in product;
}

export function getProductDisplayPrice(product: StorefrontProduct) {
  return isDBProduct(product) ? product.price / 100 : product.price;
}

export function getProductCategoryName(product: StorefrontProduct) {
  if (isDBProduct(product)) {
    return product.category.name;
  }
  return (
    altCategories.find((entry) => entry.id === product.categoryId)?.name ?? "ALT"
  );
}

export function getProductInventory(product: StorefrontProduct) {
  if (!isDBProduct(product)) {
    return product.inventory;
  }
  return product.variants.reduce((total, variant) => total + variant.inventory, 0);
}

export function getProductSizeOptions(product: StorefrontProduct) {
  if (!isDBProduct(product)) {
    return fallbackSizes;
  }

  const variantSizes = product.variants
    .filter((variant) => variant.inventory > 0)
    .sort((a, b) => a.size.localeCompare(b.size))
    .map((variant) => variant.size);

  return variantSizes.length > 0 ? variantSizes : fallbackSizes;
}

export function getProductImage(product: StorefrontProduct) {
  return product.images[0]?.url ?? "";
}
