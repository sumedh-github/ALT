"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AltButton } from "@/components/alt/alt-button";
import { formatCurrency } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist-store";

const fallbackImage = "https://picsum.photos/seed/alt-product-fallback/600/800";

export function WishlistPageContent() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="text-sm text-muted">Loading saved pieces...</div>;
  }

  if (!items.length) {
    return (
      <section className="rounded-sm border border-surface bg-surface/20 p-6 sm:p-8">
        <h2 className="font-display text-4xl leading-none text-text">
          Your wishlist is empty.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-taupe">
          Save your favorite ALT pieces and return to them later.
        </p>
        <div className="mt-6">
          <Link href="/shop">
            <AltButton>Explore Shop</AltButton>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">
          {items.length} saved {items.length === 1 ? "piece" : "pieces"}
        </p>
        <button
          type="button"
          onClick={() => clearWishlist()}
          className="text-xs uppercase tracking-[0.2em] text-taupe transition hover:text-gold"
          aria-label="Clear all wishlist items"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.productId}
            className="rounded-sm border border-surface bg-surface/25 p-4"
          >
            <div className="flex gap-4">
              <Link
                href={`/shop/${item.slug}`}
                className="relative h-32 w-24 shrink-0 overflow-hidden rounded-sm border border-surface"
              >
                <Image
                  src={item.image || fallbackImage}
                  alt={item.name}
                  fill
                  unoptimized
                  className="object-cover transition duration-500 hover:scale-105"
                  sizes="96px"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="space-y-2">
                  {item.category ? (
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      {item.category}
                    </p>
                  ) : null}
                  <Link href={`/shop/${item.slug}`} className="block">
                    <h3 className="font-display text-3xl leading-none text-text transition hover:text-gold">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm uppercase tracking-[0.2em] text-gold">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="text-xs uppercase tracking-[0.2em] text-taupe transition hover:text-gold"
                  >
                    View Product
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-xs uppercase tracking-[0.2em] text-taupe transition hover:text-gold"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
