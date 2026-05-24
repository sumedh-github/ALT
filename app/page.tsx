import { AltHero } from "@/components/alt/alt-hero";
import { AltLogoEmblem } from "@/components/alt/alt-logo-emblem";
import { PageReveal } from "@/components/alt/page-reveal";
import { ProductGrid } from "@/components/alt/product-grid";
import { SectionIntro } from "@/components/alt/section-intro";
import { altProducts } from "@/lib/mock-data";

export default function HomePage() {
  const featured = altProducts.filter((product) => product.featured).slice(0, 8);

  return (
    <div className="space-y-14 pb-8">
      <AltHero />
      <PageReveal delay={0.08} className="lg:hidden">
        <div className="flex justify-end">
          <AltLogoEmblem className="w-[220px]" />
        </div>
      </PageReveal>
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
