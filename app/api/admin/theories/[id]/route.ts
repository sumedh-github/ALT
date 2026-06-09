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

const theoryUpdateSchema = z.object({
  number: z.string().trim().min(3),
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  tagline: z.string().optional().or(z.literal("")).default(""),
  description: z.string().min(500),
  season: z.string().optional().or(z.literal("")).default(""),
  year: z
    .union([z.coerce.number().int(), z.null(), z.literal("")])
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : value)),
  image: z.string().optional().or(z.literal("")).default(""),
  active: booleanFromInputSchema.optional().default(true),
  productIds: z.array(z.string()).optional().default([])
});

interface TheoryRouteProps {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: TheoryRouteProps) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const body = await request.json();
    const parsed = theoryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const imageValidation = localOrRemoteImageSchema.safeParse(payload.image);
    if (!imageValidation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: { fieldErrors: { image: [imageValidation.error.issues[0]?.message ?? "Invalid image"] } }
        },
        { status: 400 }
      );
    }

    const theory = await prisma.theory.update({
      where: { id: params.id },
      data: {
        number: payload.number,
        name: payload.name,
        slug: payload.slug,
        tagline: payload.tagline,
        description: payload.description,
        season: payload.season,
        year: payload.year ?? null,
        image: payload.image,
        active: payload.active,
        products: {
          deleteMany: {},
          create: payload.productIds.map((productId, index) => ({
            productId,
            position: index
          }))
        }
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });
    return NextResponse.json({ theory });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update theory." }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: TheoryRouteProps) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    await prisma.theory.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete theory." }, { status: 500 });
  }
}
