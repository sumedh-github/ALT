import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const inventoryUpdateSchema = z.object({
  inventory: z.number().int().nonnegative()
});

interface InventoryRouteProps {
  params: {
    variantId: string;
  };
}

export async function PATCH(request: NextRequest, { params }: InventoryRouteProps) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const body = await request.json();
    const payload = inventoryUpdateSchema.parse(body);
    const variant = await prisma.productVariant.update({
      where: { id: params.variantId },
      data: { inventory: payload.inventory },
      select: {
        id: true,
        inventory: true
      }
    });
    return NextResponse.json({ variant });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid inventory payload." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to update inventory right now." },
      { status: 500 }
    );
  }
}
