import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const lookbookPayloadSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().url(),
  order: z.number().int().nonnegative().optional(),
  active: z.boolean().default(true),
  productId: z.string().optional().nullable()
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
    const payload = lookbookPayloadSchema.parse(body);
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid lookbook payload.", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create lookbook entry." },
      { status: 500 }
    );
  }
}
