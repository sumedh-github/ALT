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

const createDiscountSchema = z.object({
  code: z.string().trim().min(3),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().positive(),
  maxUses: z
    .union([z.coerce.number().int().positive(), z.null(), z.literal("")])
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : value)),
  expiresAt: z
    .union([z.string().datetime(), z.null(), z.literal("")])
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : value)),
  active: booleanFromInputSchema.optional().default(true)
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
    const parsed = createDiscountSchema.safeParse(body);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const payload = parsed.data;

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
    return NextResponse.json({ error: "Failed to create discount." }, { status: 500 });
  }
}
