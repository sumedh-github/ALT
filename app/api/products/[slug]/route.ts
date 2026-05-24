import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type ProductBySlugRouteProps = {
  params: { slug: string };
};

export async function GET(
  _request: Request,
  { params }: ProductBySlugRouteProps
) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, images: { orderBy: { position: "asc" } } }
  });

  if (!product) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({
    product: {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price / 100,
      inventory: product.inventory,
      featured: product.featured,
      category: product.category.name,
      images: product.images
    }
  });
}
