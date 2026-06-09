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

const productPayloadSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  categoryId: z.string().trim().min(1),
  shortDescription: z.string().optional().or(z.literal("")).default(""),
  description: z.string().trim().min(8),
  price: z.coerce.number().int().nonnegative(),
  compareAtPrice: z
    .union([z.coerce.number().int().nonnegative(), z.null(), z.literal("")])
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : value)),
  status: z.enum(["DRAFT", "ACTIVE"]),
  featured: booleanFromInputSchema.optional().default(false),
  variants: z
    .array(
      z.object({
        size: z.string().trim().min(1),
        inventory: z.coerce.number().int().nonnegative()
      })
    )
    .optional()
    .default([])
    .refine((value) => value.length > 0, "At least one variant is required."),
  images: z.array(z.string().trim()).optional().default([])
});

export async function GET() {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        variants: {
          select: { id: true, size: true, sku: true, inventory: true }
        },
        images: {
          select: { id: true, url: true, position: true },
          orderBy: { position: "asc" }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load products." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const body = await request.json();
    const parsed = productPayloadSchema.safeParse(body);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const payload = parsed.data;

    const imageValidation = z.array(localOrRemoteImageSchema).safeParse(payload.images);
    if (!imageValidation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: imageValidation.error.flatten() },
        { status: 400 }
      );
    }

    const created = await prisma.product.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        categoryId: payload.categoryId,
        shortDescription: payload.shortDescription,
        description: payload.description,
        price: payload.price,
        status: payload.status,
        featured: payload.featured,
        variants: {
          create: payload.variants.map((variant) => ({
            size: variant.size,
            inventory: variant.inventory,
            sku: `${payload.slug}-${variant.size}`.toUpperCase()
          }))
        },
        images: {
          create: payload.images.map((url, index) => ({
            url,
            position: index,
            alt: payload.name
          }))
        }
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    return NextResponse.json({ product: created }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
