import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const updateDiscountSchema = z.object({
  active: z.boolean()
});

interface DiscountRouteProps {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: DiscountRouteProps) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const body = await request.json();
    const payload = updateDiscountSchema.parse(body);
    const discount = await prisma.discountCode.update({
      where: { id: params.id },
      data: {
        active: payload.active
      },
      select: {
        id: true,
        active: true
      }
    });
    return NextResponse.json({ discount });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid discount update payload.", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to update discount." }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: DiscountRouteProps) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    await prisma.discountCode.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete discount." }, { status: 500 });
  }
}
