import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
  trackingNumber: z.string().optional().or(z.literal("")),
  internalNotes: z.string().optional().or(z.literal(""))
});

interface OrderRouteProps {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: OrderRouteProps) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const body = await request.json();
    const parsed = updateOrderSchema.safeParse(body);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const payload = parsed.data;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: payload.status
      },
      select: {
        id: true,
        status: true
      }
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
  }
}
