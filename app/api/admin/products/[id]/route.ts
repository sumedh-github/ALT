import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

const productUpdateSchema = z.object({
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

const productStatusUpdateSchema = z
  .object({
    status: z.enum(["DRAFT", "ACTIVE", "DELETED"])
  })
  .strict();

function revalidateProductPaths(slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/shop/[slug]", "page");
  if (slug) {
    revalidatePath(`/shop/${slug}`);
  }
  revalidatePath("/");
}

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
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      select: { slug: true }
    });
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const body = await request.json();
    const statusUpdate = productStatusUpdateSchema.safeParse(body);
    if (statusUpdate.success) {
      const updatedStatus = await prisma.product.update({
        where: { id: params.id },
        data: {
          status: statusUpdate.data.status
        },
        select: {
          id: true,
          slug: true,
          name: true,
          status: true
        }
      });

      revalidateProductPaths(updatedStatus.slug);
      revalidateProductPaths(existingProduct.slug);
      return NextResponse.json({ product: updatedStatus });
    }

    const parsed = productUpdateSchema.safeParse(body);
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

    revalidateProductPaths(updated.slug);
    revalidateProductPaths(existingProduct.slug);

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: ProductRouteProps) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const current = await prisma.product.findUnique({
      where: { id: params.id },
      select: {
        slug: true
      }
    });
    if (!current) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    await prisma.product.update({
      where: { id: params.id },
      data: { status: "DELETED" }
    });

    revalidateProductPaths(current.slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
