"use client";

import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { AltProduct } from "@/lib/mock-data";
import { altCategories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist-store";

interface WishlistButtonProps {
  product: AltProduct;
  variant?: "icon" | "full";
  className?: string;
}

export function WishlistButton({
  product,
  variant = "icon",
  className
}: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false);
  const isWishlisted = useWishlistStore((state) =>
    state.items.some((item) => item.productId === product.id)
  );
  const toggleItem = useWishlistStore((state) => state.toggleItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const category = useMemo(() => {
    return altCategories.find((entry) => entry.id === product.categoryId)?.name;
  }, [product.categoryId]);

  const label = mounted && isWishlisted
    ? `Remove ${product.name} from wishlist`
    : `Add ${product.name} to wishlist`;

  const onToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!mounted) {
      return;
    }

    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0]?.url ?? "",
      category
    });
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center gap-2 rounded-sm border border-taupe/35 bg-transparent px-4 py-3 font-body text-xs uppercase tracking-[0.22em] text-taupe transition duration-200 hover:border-gold hover:text-gold",
          mounted && isWishlisted ? "border-gold text-gold" : "",
          className
        )}
      >
        <Heart
          size={16}
          className={cn(
            "transition-colors",
            mounted && isWishlisted ? "fill-gold text-gold" : "text-taupe"
          )}
        />
        <span>
          {mounted && isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-taupe/40 bg-black/45 text-taupe backdrop-blur-sm transition duration-200 hover:border-gold hover:text-gold",
        mounted && isWishlisted ? "border-gold text-gold" : "",
        className
      )}
    >
      <Heart
        size={18}
        className={cn(
          "transition-colors",
          mounted && isWishlisted ? "fill-gold text-gold" : "text-current"
        )}
      />
    </button>
  );
}
