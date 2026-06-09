import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const productUpdateSchema = z.object({
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

interface ProductRouteProps {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: ProductRouteProps) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const body = await request.json();
    const payload = productUpdateSchema.parse(body);

    const updated = await prisma.product.update({
      where: { id: params.id },
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
          deleteMany: {},
          create: payload.variants.map((variant) => ({
            size: variant.size,
            inventory: variant.inventory,
            sku: `${payload.slug}-${variant.size}`.toUpperCase()
          }))
        },
        images: {
          deleteMany: {},
          create: payload.images.map((url, index) => ({
            url,
            position: index,
            alt: payload.name
          }))
        }
      },
      select: {
        id: true,
        slug: true,
        name: true
      }
    });

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid product payload.", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: ProductRouteProps) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    await prisma.product.update({
      where: { id: params.id },
      data: { status: "DELETED" }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
