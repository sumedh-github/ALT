import { notFound } from "next/navigation";

import { TheoryForm } from "@/components/admin/theory-form";
import { prisma } from "@/lib/prisma";

interface EditTheoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditTheoryPage({ params }: EditTheoryPageProps) {
  const [products, theory] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        images: {
          select: { url: true },
          orderBy: { position: "asc" },
          take: 1
        }
      },
      orderBy: { name: "asc" }
    }),
    prisma.theory.findUnique({
      where: { id: params.id },
      include: {
        products: {
          select: { productId: true },
          orderBy: { position: "asc" }
        }
      }
    })
  ]);

  if (!theory) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#e2e4ed]">Edit Theory</h1>
        <p className="text-sm text-[#6b7280]">{theory.name}</p>
      </header>
      <TheoryForm
        mode="edit"
        products={products.map((product) => ({
          id: product.id,
          name: product.name,
          image: product.images[0]?.url ?? null
        }))}
        initialData={{
          id: theory.id,
          number: theory.number,
          name: theory.name,
          slug: theory.slug,
          tagline: theory.tagline ?? "",
          description: theory.description,
          season: theory.season ?? "",
          year: theory.year ?? null,
          image: theory.image,
          productIds: theory.products.map((item) => item.productId)
        }}
      />
    </div>
  );
}
