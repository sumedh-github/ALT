"use client";

import { useState } from "react";

import { AltButton } from "@/components/alt/alt-button";
import type { AltProduct } from "@/lib/mock-data";
import { useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";

const sizes = ["XS", "S", "M", "L", "XL"] as const;

interface AddToCartFormProps {
  product: AltProduct;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const [size, setSize] = useState<(typeof sizes)[number]>("M");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-5 rounded-sm border border-surface bg-surface/30 p-5">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">Size</p>
        <div className="grid grid-cols-5 gap-2">
          {sizes.map((item) => (
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
          onClick={() => setQuantity((previous) => Math.min(10, previous + 1))}
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
            price: product.price,
            image: product.images[0]?.url ?? ""
          });
          setCartOpen(true);
        }}
      >
        Add to Cart
      </AltButton>
    </div>
  );
}
