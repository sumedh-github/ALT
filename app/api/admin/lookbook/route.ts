import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const localOrRemoteImageSchema = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return false;
    if (value.startsWith("/uploads/")) return true;
    return z.string().url().safeParse(value).success;
  }, "Image must be a valid URL or /uploads path.");

const booleanFromInputSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return value;
}, z.boolean());

const lookbookPayloadSchema = z.object({
  title: z.string().trim().min(2),
  subtitle: z.string().optional().nullable().or(z.literal("")),
  imageUrl: z.string().trim(),
  order: z.coerce.number().int().nonnegative().optional(),
  active: booleanFromInputSchema.optional().default(true),
  productId: z
    .string()
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((value) => (value === "" ? null : value))
});

export async function GET() {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const entries = await prisma.lookbookEntry.findMany({
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
    });
    return NextResponse.json({ entries });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load lookbook entries." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const body = await request.json();
    const parsed = lookbookPayloadSchema.safeParse(body);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const payload = parsed.data;
    const imageValidation = localOrRemoteImageSchema.safeParse(payload.imageUrl);
    if (!imageValidation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: { fieldErrors: { imageUrl: [imageValidation.error.issues[0]?.message ?? "Invalid image"] } }
        },
        { status: 400 }
      );
    }

    const highestOrder = await prisma.lookbookEntry.findFirst({
      orderBy: { order: "desc" },
      select: { order: true }
    });

    const entry = await prisma.lookbookEntry.create({
      data: {
        title: payload.title,
        subtitle: payload.subtitle ?? null,
        imageUrl: payload.imageUrl,
        order: payload.order ?? (highestOrder?.order ?? -1) + 1,
        active: payload.active,
        productId: payload.productId ?? null
      },
      include: {
        product: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create lookbook entry." },
      { status: 500 }
    );
  }
}
