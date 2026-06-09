import { LookbookPanel } from "@/components/admin/lookbook-panel";
import { prisma } from "@/lib/prisma";

export default async function AdminLookbookPage() {
  const [entries, products] = await Promise.all([
    prisma.lookbookEntry.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }]
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" }
    })
  ]);

  return <LookbookPanel entries={entries} products={products} />;
}
