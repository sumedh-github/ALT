import { ProductGrid } from "@/components/alt/product-grid";
import { SectionIntro } from "@/components/alt/section-intro";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop | Avero Loose Theory"
};

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: {
      images: {
        orderBy: { position: "asc" }
      },
      variants: true,
      category: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 pb-8">
      <SectionIntro
        eyebrow="Shop"
        title="The Oversized Theory Collection"
        body="Discover the complete ALT line: structured outerwear, volume bottoms, dense tops, and accessories shaped for dark luxury layering."
      />
      <ProductGrid products={products} />
    </div>
  );
}
