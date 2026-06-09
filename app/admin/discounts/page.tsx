import { DiscountsPanel } from "@/components/admin/discounts-panel";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDiscountsPage() {
  const discounts = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      percentageOff: true,
      amountOff: true,
      usesCount: true,
      maxUses: true,
      expiresAt: true,
      active: true
    }
  });

  return <DiscountsPanel discounts={discounts} />;
}
