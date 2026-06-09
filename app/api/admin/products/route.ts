import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const productPayloadSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  categoryId: z.string().min(1),
  shortDescription: z.string().optional().default(""),
  description: z.string().min(8),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().nonnegative().nullable().optional(),
  status: z.enum(["DRAFT", "ACTIVE"]),
  featured: z.boolean(),
  variants: z
    .array(
      z.object({
        size: z.string().min(1),
        inventory: z.number().int().nonnegative()
      })
    )
    .min(1),
  images: z.array(z.string().url()).max(5)
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
    const payload = productPayloadSchema.parse(body);
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid product payload.", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
