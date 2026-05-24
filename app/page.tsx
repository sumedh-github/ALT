import { AltHero } from "@/components/alt/alt-hero";
import { PageReveal } from "@/components/alt/page-reveal";
import { ProductGrid } from "@/components/alt/product-grid";
import { SectionIntro } from "@/components/alt/section-intro";
import { altProducts } from "@/lib/mock-data";

export default function HomePage() {
  const featured = altProducts.filter((product) => product.featured).slice(0, 6);

  return (
    <div className="space-y-14 pb-8">
      <AltHero />
      <PageReveal delay={0.15}>
        <SectionIntro
          eyebrow="Featured Pieces"
          title="Cut for Presence"
          body="ALT silhouettes are built in weight, shape, and restraint. Every piece is designed to hold calm power without visual noise."
        />
      </PageReveal>
      <ProductGrid products={featured} />
    </div>
  );
}
