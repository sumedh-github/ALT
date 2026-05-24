import { ProductGrid } from "@/components/alt/product-grid";
import { SectionIntro } from "@/components/alt/section-intro";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "Collection | Avero Loose Theory"
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="space-y-8 pb-8">
      <SectionIntro
        eyebrow="Collection"
        title="Structured Oversize"
        body="Every ALT piece is designed for layered silhouettes and understated gravity. Select forms, textures, and tones for your own oversized theory."
      />
      <ProductGrid products={products} />
    </div>
  );
}
