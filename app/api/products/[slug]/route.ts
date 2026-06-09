import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface ProductBySlugRouteProps {
  params: {
    slug: string;
  };
}

export async function GET(_: Request, { params }: ProductBySlugRouteProps) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug.toLowerCase() },
      include: {
        images: {
          orderBy: { position: "asc" }
        },
        variants: {
          orderBy: { size: "asc" }
        },
        category: true
      }
    });

    if (!product || product.status !== "ACTIVE") {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to load product right now." },
      { status: 500 }
    );
  }
}
