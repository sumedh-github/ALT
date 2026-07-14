import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const theories = await prisma.theory.findMany({
      where: { active: true },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { position: "asc" }
                }
              }
            }
          },
          orderBy: { position: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const serialized = theories.map((theory) => ({
      ...theory,
      theoryProducts: theory.products.filter(
        (item) => item.product.status === "ACTIVE"
      )
    }));

    return NextResponse.json({ theories: serialized });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to load theories right now." },
      { status: 500 }
    );
  }
}
