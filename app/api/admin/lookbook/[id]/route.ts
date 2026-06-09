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

const lookbookUpdateSchema = z.object({
  title: z.string().trim().min(2).optional(),
  subtitle: z.string().optional().nullable().or(z.literal("")),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value)),
  order: z.coerce.number().int().nonnegative().optional(),
  active: booleanFromInputSchema.optional(),
  productId: z
    .string()
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((value) => (value === "" ? null : value))
});

interface LookbookRouteProps {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: LookbookRouteProps) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const body = await request.json();
    const parsed = lookbookUpdateSchema.safeParse(body);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const payload = parsed.data;

    if (payload.imageUrl !== undefined) {
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
    }

    const entry = await prisma.lookbookEntry.update({
      where: { id: params.id },
      data: {
        ...(payload.title !== undefined ? { title: payload.title } : {}),
        ...(payload.subtitle !== undefined ? { subtitle: payload.subtitle } : {}),
        ...(payload.imageUrl !== undefined ? { imageUrl: payload.imageUrl } : {}),
        ...(payload.order !== undefined ? { order: payload.order } : {}),
        ...(payload.active !== undefined ? { active: payload.active } : {}),
        ...(payload.productId !== undefined ? { productId: payload.productId } : {})
      },
      include: {
        product: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
    return NextResponse.json({ entry });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update lookbook entry." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: LookbookRouteProps) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    await prisma.lookbookEntry.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete lookbook entry." },
      { status: 500 }
    );
  }
}
