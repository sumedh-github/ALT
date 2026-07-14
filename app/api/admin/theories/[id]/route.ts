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

const theoryUpdateSchema = z.object({
  number: z.string().trim().min(3).optional(),
  name: z.string().trim().min(2).optional(),
  slug: z.string().trim().min(2).optional(),
  tagline: z.string().optional().nullable().or(z.literal("")),
  description: z.string().min(500).optional(),
  season: z.string().optional().nullable().or(z.literal("")),
  year: z
    .union([z.coerce.number().int(), z.null(), z.literal("")])
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : value)),
  image: z.string().optional().or(z.literal("")),
  active: booleanFromInputSchema.optional(),
  productIds: z.array(z.string()).optional()
});

function revalidateTheoryPaths(slug?: string) {
  revalidatePath("/admin/theories");
  revalidatePath("/theories");
  revalidatePath("/theories/[slug]", "page");
  if (slug) {
    revalidatePath(`/theories/${slug}`);
  }
  revalidatePath("/");
}

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
    const existingTheory = await prisma.theory.findUnique({
      where: { id: params.id },
      select: { slug: true }
    });
    if (!existingTheory) {
      return NextResponse.json({ error: "Theory not found." }, { status: 404 });
    }

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
    if (payload.image !== undefined && payload.image !== "") {
      const imageValidation = localOrRemoteImageSchema.safeParse(payload.image);
      if (!imageValidation.success) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: {
              fieldErrors: { image: [imageValidation.error.issues[0]?.message ?? "Invalid image"] }
            }
          },
          { status: 400 }
        );
      }
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: { fieldErrors: { payload: ["No fields provided for update."] } }
        },
        { status: 400 }
      );
    }

    const theory = await prisma.theory.update({
      where: { id: params.id },
      data: {
        ...(payload.number !== undefined ? { number: payload.number } : {}),
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.slug !== undefined ? { slug: payload.slug } : {}),
        ...(payload.tagline !== undefined ? { tagline: payload.tagline ?? "" } : {}),
        ...(payload.description !== undefined ? { description: payload.description } : {}),
        ...(payload.season !== undefined ? { season: payload.season ?? "" } : {}),
        ...(payload.year !== undefined ? { year: payload.year } : {}),
        ...(payload.image !== undefined ? { image: payload.image } : {}),
        ...(payload.active !== undefined ? { active: payload.active } : {}),
        ...(payload.productIds !== undefined
          ? {
              products: {
                deleteMany: {},
                create: payload.productIds.map((productId, index) => ({
                  productId,
                  position: index
                }))
              }
            }
          : {})
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    revalidateTheoryPaths(theory.slug);
    revalidateTheoryPaths(existingTheory.slug);
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
    const existingTheory = await prisma.theory.findUnique({
      where: { id: params.id },
      select: { slug: true }
    });
    if (!existingTheory) {
      return NextResponse.json({ error: "Theory not found." }, { status: 404 });
    }

    await prisma.theory.update({
      where: { id: params.id },
      data: { active: false }
    });

    revalidateTheoryPaths(existingTheory.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete theory." }, { status: 500 });
  }
}
