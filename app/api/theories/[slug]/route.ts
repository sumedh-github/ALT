import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface TheoryBySlugRouteProps {
  params: {
    slug: string;
  };
}

export async function GET(_: Request, { params }: TheoryBySlugRouteProps) {
  try {
    const theory = await prisma.theory.findUnique({
      where: { slug: params.slug.toLowerCase() },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { position: "asc" }
                },
                variants: true,
                category: true
              }
            }
          },
          orderBy: { position: "asc" }
        }
      }
    });

    if (!theory || !theory.active) {
      return NextResponse.json({ error: "Theory not found." }, { status: 404 });
    }

    const activeProducts = theory.products.filter(
      (item) => item.product.status === "ACTIVE"
    );

    return NextResponse.json({
      theory: {
        ...theory,
        theoryProducts: activeProducts
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to load theory right now." },
      { status: 500 }
    );
  }
}
