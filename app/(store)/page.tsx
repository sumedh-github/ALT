import { AltHero } from "@/components/alt/alt-hero";
import { PageReveal } from "@/components/alt/page-reveal";
import { ProductGrid } from "@/components/alt/product-grid";
import { SectionIntro } from "@/components/alt/section-intro";
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="space-y-14 pb-8">
      <AltHero />
      <PageReveal delay={0.15}>
        <SectionIntro
          eyebrow="Featured Pieces"
          title="Cut for Presence"
          body="Volume-driven essentials designed to drape with intent. ALT staples are built to stay calm while everything around them performs."
        />
      </PageReveal>
      <ProductGrid products={products} />
    </div>
  );
}
