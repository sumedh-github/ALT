import { TheoryForm } from "@/components/admin/theory-form";
import { prisma } from "@/lib/prisma";

export default async function NewTheoryPage() {
  const products = await prisma.product.findMany({
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
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#e2e4ed]">Add Theory</h1>
        <p className="text-sm text-[#6b7280]">Create a new drop and connect products.</p>
      </header>
      <TheoryForm
        mode="create"
        products={products.map((product) => ({
          id: product.id,
          name: product.name,
          image: product.images[0]?.url ?? null
        }))}
      />
    </div>
  );
}
