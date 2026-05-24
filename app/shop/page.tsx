import { ProductGrid } from "@/components/alt/product-grid";
import { SectionIntro } from "@/components/alt/section-intro";
import { altProducts } from "@/lib/mock-data";

export const metadata = {
  title: "Shop | Avero Loose Theory"
};

export default function ShopPage() {
  return (
    <div className="space-y-8 pb-8">
      <SectionIntro
        eyebrow="Shop"
        title="The Oversized Theory Collection"
        body="Discover the complete ALT line: structured outerwear, volume bottoms, dense tops, and accessories shaped for dark luxury layering."
      />
      <ProductGrid products={altProducts} />
    </div>
  );
}
