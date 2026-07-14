import { InventoryPanel } from "@/components/admin/inventory-panel";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    where: { status: { in: ["ACTIVE", "DRAFT"] } },
    include: {
      category: {
        select: { name: true }
      },
      variants: {
        select: {
          id: true,
          size: true,
          inventory: true
        }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <InventoryPanel
      products={products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category.name,
        variants: product.variants
      }))}
    />
  );
}
