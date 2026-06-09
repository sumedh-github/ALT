import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [categories, product] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true }
    }),
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        variants: {
          select: { size: true, inventory: true },
          orderBy: { size: "asc" }
        },
        images: {
          select: { url: true, position: true },
          orderBy: { position: "asc" }
        }
      }
    })
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#e2e4ed]">Edit Product</h1>
        <p className="text-sm text-[#6b7280]">{product.name}</p>
      </header>
      <ProductForm
        mode="edit"
        categories={categories}
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          shortDescription: product.shortDescription ?? "",
          description: product.description,
          price: product.price,
          compareAtPrice: null,
          status: product.status === "ACTIVE" ? "ACTIVE" : "DRAFT",
          featured: product.featured,
          variants: product.variants.map((variant) => ({
            size: variant.size,
            inventory: variant.inventory
          })),
          images: product.images.map((image) => image.url)
        }}
      />
    </div>
  );
}
