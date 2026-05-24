import { PageReveal } from "@/components/alt/page-reveal";
import { ProductCard } from "@/components/alt/product-card";
import type { AltProduct } from "@/lib/mock-data";

interface ProductGridProps {
  products: AltProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <PageReveal key={product.id} delay={index * 0.08}>
          <ProductCard product={product} />
        </PageReveal>
      ))}
    </section>
  );
}
