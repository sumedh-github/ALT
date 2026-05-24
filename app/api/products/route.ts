import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productInputSchema } from "@/lib/validations/product";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true, images: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({
    products: products.map((product) => ({
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
    }))
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload." },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      shortDescription: parsed.data.shortDescription,
      price: Math.round(parsed.data.price * 100),
      inventory: parsed.data.inventory,
      featured: parsed.data.featured,
      categoryId: parsed.data.categoryId,
      images: {
        create: parsed.data.imageUrls.map((url, position) => ({
          url,
          alt: parsed.data.name,
          position
        }))
      }
    }
  });

  return NextResponse.json({ product }, { status: 201 });
}
