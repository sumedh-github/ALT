import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const lookbookUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().url().optional(),
  order: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
  productId: z.string().optional().nullable()
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
    const payload = lookbookUpdateSchema.parse(body);
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid lookbook payload.", details: error.flatten() },
        { status: 400 }
      );
    }
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
