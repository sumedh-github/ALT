import Image from "next/image";
import Link from "next/link";

import { WishlistButton } from "@/components/alt/wishlist-button";
import {
  getProductCategoryName,
  getProductDisplayPrice
} from "@/lib/storefront-products";
import { formatCurrency } from "@/lib/utils";
import type { StorefrontProduct } from "@/types/product";

interface ProductCardProps {
  product: StorefrontProduct;
}

const fallbackImage = "https://picsum.photos/seed/alt-product-fallback/600/800";

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];
  const category = getProductCategoryName(product);

  return (
    <article className="group rounded-sm border border-surface bg-surface/30 p-3 transition duration-300 hover:border-gold/50">
      <div className="relative">
        <Link href={`/shop/${product.slug}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#2a2a2a]">
            <Image
              src={image?.url ?? fallbackImage}
              alt={image?.alt ?? product.name}
              fill
              unoptimized
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="space-y-2 px-1 pb-2 pt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{category}</p>
            <h3 className="font-display text-2xl leading-none text-text">{product.name}</h3>
            <p className="line-clamp-2 text-sm text-taupe">
              {product.shortDescription ?? product.description}
            </p>
            <p className="text-sm uppercase tracking-[0.2em] text-gold">
              {formatCurrency(getProductDisplayPrice(product))}
            </p>
          </div>
        </Link>

        <div className="absolute right-3 top-3 z-20">
          <WishlistButton product={product} variant="icon" />
        </div>
      </div>
    </article>
  );
}
