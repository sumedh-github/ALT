import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const createDiscountSchema = z.object({
  code: z.string().min(3),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  active: z.boolean().default(true)
});

export async function GET() {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const discounts = await prisma.discountCode.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ discounts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load discounts." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const body = await request.json();
    const payload = createDiscountSchema.parse(body);
    const discount = await prisma.discountCode.create({
      data: {
        code: payload.code.toUpperCase(),
        percentageOff: payload.type === "PERCENTAGE" ? Math.round(payload.value) : null,
        amountOff: payload.type === "FIXED" ? Math.round(payload.value * 100) : null,
        maxUses: payload.maxUses ?? null,
        expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
        active: payload.active
      },
      select: {
        id: true,
        code: true,
        active: true
      }
    });
    return NextResponse.json({ discount }, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid discount payload.", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create discount." }, { status: 500 });
  }
}
