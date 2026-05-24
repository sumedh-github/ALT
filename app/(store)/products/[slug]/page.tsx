import Image from "next/image";
import { notFound } from "next/navigation";

import { AddToCartForm } from "@/components/alt/add-to-cart-form";
import { PageReveal } from "@/components/alt/page-reveal";
import { formatCurrency } from "@/lib/utils";
import { getProductBySlug } from "@/lib/products";

type ProductDetailPageProps = {
  params: { slug: string };
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-10 pb-8 pt-4 lg:grid-cols-[1.1fr_0.9fr]">
      <PageReveal className="relative aspect-[4/5] overflow-hidden rounded-sm border border-surface">
        <Image
          src={product.images[0]?.url ?? "https://res.cloudinary.com/demo/image/upload/v1/alt-fallback.jpg"}
          alt={product.images[0]?.alt ?? product.name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
        />
      </PageReveal>
      <PageReveal delay={0.15} className="space-y-5">
        <p className="text-xs uppercase tracking-[0.3em] text-taupe">{product.category}</p>
        <h1 className="font-display text-5xl leading-[0.95]">{product.name}</h1>
        <p className="text-sm uppercase tracking-[0.22em] text-gold">
          {formatCurrency(product.price)}
        </p>
        <p className="max-w-xl text-sm leading-relaxed text-taupe sm:text-base">
          {product.description}
        </p>
        <AddToCartForm product={product} />
      </PageReveal>
    </div>
  );
}
