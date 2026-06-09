import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const booleanFromInputSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return value;
}, z.boolean());

const updateDiscountSchema = z.object({
  active: booleanFromInputSchema
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
    const parsed = updateDiscountSchema.safeParse(body);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const payload = parsed.data;

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
