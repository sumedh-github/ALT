import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { AddToCartForm } from "@/components/alt/add-to-cart-form";
import { PageReveal } from "@/components/alt/page-reveal";
import { WishlistButton } from "@/components/alt/wishlist-button";
import {
  getProductCategoryName,
  getProductDisplayPrice,
  getProductInventory
} from "@/lib/storefront-products";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

interface ShopProductPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

const legacySlugRedirects: Record<string, string> = {
  "obsidian-drape-hoodie": "obsidian-oversized-hoodie",
  "gold-stitch-box-tee": "gold-stitch-oversized-tee",
  "charcoal-veil-trench": "shadow-striped-oversized-shirt",
  "charcaol-veil-trench": "shadow-striped-oversized-shirt"
};

export async function generateStaticParams() {
  return [];
}

export default async function ShopProductPage({ params }: ShopProductPageProps) {
  const normalizedSlug = params.slug.toLowerCase();
  const redirectSlug = legacySlugRedirects[normalizedSlug];
  if (redirectSlug) {
    redirect(`/shop/${redirectSlug}`);
  }

  const product = await prisma.product.findUnique({
    where: { slug: normalizedSlug },
    include: {
      images: {
        orderBy: { position: "asc" }
      },
      variants: true,
      category: true
    }
  });

  if (!product || product.status !== "ACTIVE") {
    notFound();
  }

  const category = getProductCategoryName(product);

  return (
    <div className="grid gap-10 pb-8 pt-4 lg:grid-cols-[1.1fr_0.9fr]">
      <PageReveal className="relative aspect-[4/5] overflow-hidden rounded-sm border border-surface">
        <Image
          src={
            product.images[0]?.url ??
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
          }
          alt={product.images[0]?.alt ?? product.name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
        />
      </PageReveal>
      <PageReveal delay={0.15} className="space-y-5">
        <p className="text-xs uppercase tracking-[0.3em] text-taupe">{category}</p>
        <h1 className="font-display text-5xl leading-[0.95]">{product.name}</h1>
        <p className="text-sm uppercase tracking-[0.22em] text-gold">
          {formatCurrency(getProductDisplayPrice(product))}
        </p>
        <p className="max-w-xl text-sm leading-relaxed text-taupe sm:text-base">
          {product.description}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          {getProductInventory(product)} units currently available
        </p>
        <div className="space-y-3">
          <AddToCartForm product={product} />
          <WishlistButton product={product} variant="full" className="w-full" />
        </div>
      </PageReveal>
    </div>
  );
}
