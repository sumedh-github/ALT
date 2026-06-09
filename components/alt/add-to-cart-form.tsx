"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getProductDisplayPrice,
  getProductImage,
  getProductSizeOptions,
  isDBProduct
} from "@/lib/storefront-products";

import { AltButton } from "@/components/alt/alt-button";
import { useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";
import type { StorefrontProduct } from "@/types/product";

interface AddToCartFormProps {
  product: StorefrontProduct;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const sizeOptions = useMemo(() => getProductSizeOptions(product), [product]);
  const [size, setSize] = useState(sizeOptions[0] ?? "M");
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = useMemo(() => {
    if (!isDBProduct(product)) {
      return 10;
    }
    const matchingVariant = product.variants.find((variant) => variant.size === size);
    return Math.max(1, Math.min(10, matchingVariant?.inventory ?? 1));
  }, [product, size]);

  useEffect(() => {
    if (!sizeOptions.includes(size)) {
      setSize(sizeOptions[0] ?? "M");
    }
  }, [size, sizeOptions]);

  return (
    <div className="space-y-5 rounded-sm border border-surface bg-surface/30 p-5">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">Size</p>
        <div className="grid grid-cols-6 gap-2">
          {sizeOptions.map((item) => (
            <button
              key={item}
              type="button"
              className={`rounded-sm border px-2 py-2 text-xs uppercase tracking-[0.2em] transition ${
                size === item
                  ? "border-gold text-gold"
                  : "border-surface text-taupe hover:border-taupe"
              }`}
              onClick={() => setSize(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Quantity</p>
        <button
          type="button"
          className="rounded-sm border border-surface px-2 py-1 hover:border-gold"
          onClick={() => setQuantity((previous) => Math.max(1, previous - 1))}
        >
          -
        </button>
        <span className="text-sm">{quantity}</span>
        <button
          type="button"
          className="rounded-sm border border-surface px-2 py-1 hover:border-gold"
          onClick={() =>
            setQuantity((previous) => Math.min(maxQuantity, previous + 1))
          }
        >
          +
        </button>
      </div>
      <AltButton
        className="w-full"
        onClick={() => {
          addItem({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            quantity,
            size,
            price: getProductDisplayPrice(product),
            image: getProductImage(product)
          });
          setCartOpen(true);
        }}
      >
        Add to Cart
      </AltButton>
    </div>
  );
}
