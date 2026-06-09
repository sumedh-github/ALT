import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const theoryUpdateSchema = z.object({
  number: z.string().min(3),
  name: z.string().min(2),
  slug: z.string().min(2),
  tagline: z.string().optional().default(""),
  description: z.string().min(500),
  season: z.string().optional().default(""),
  year: z.number().int().optional().nullable(),
  image: z.string().url(),
  active: z.boolean().default(true),
  productIds: z.array(z.string()).default([])
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
    const payload = theoryUpdateSchema.parse(body);
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid theory payload.", details: error.flatten() },
        { status: 400 }
      );
    }
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
