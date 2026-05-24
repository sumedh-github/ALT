import Image from "next/image";
import Link from "next/link";

import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];

  return (
    <article className="group rounded-sm border border-surface bg-surface/30 p-3 transition duration-300 hover:border-gold/50">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-bg">
          <Image
            src={image?.url ?? "https://res.cloudinary.com/demo/image/upload/v1/alt-fallback.jpg"}
            alt={image?.alt ?? product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="space-y-2 px-1 pb-2 pt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {product.category}
          </p>
          <h3 className="font-display text-2xl leading-none text-text">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm text-taupe">{product.shortDescription}</p>
          <p className="text-sm uppercase tracking-[0.2em] text-gold">
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
    </article>
  );
}
