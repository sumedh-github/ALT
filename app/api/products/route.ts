import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

function parseBoolean(value: string | null) {
  if (!value) return undefined;
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  return undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const featured = parseBoolean(searchParams.get("featured"));
    const theory = searchParams.get("theory");
    const search = searchParams.get("search");

    const where: Prisma.ProductWhereInput = {
      status: "ACTIVE",
      ...(category
        ? {
            category: {
              slug: category
            }
          }
        : {}),
      ...(typeof featured === "boolean" ? { featured } : {}),
      ...(theory
        ? {
            theories: {
              some: {
                theory: {
                  slug: theory
                }
              }
            }
          }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { shortDescription: { contains: search, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { position: "asc" }
        },
        variants: {
          orderBy: { size: "asc" }
        },
        category: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to load products right now." },
      { status: 500 }
    );
  }
}
