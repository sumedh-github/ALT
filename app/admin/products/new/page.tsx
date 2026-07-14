import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#e2e4ed]">Add Product</h1>
        <p className="text-sm text-[#6b7280]">Create a new product for ALT inventory.</p>
      </header>
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
