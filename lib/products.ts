import type { Product } from "@/types";
import { prisma } from "@/lib/prisma";
import { altFeaturedProducts } from "@/lib/mock-data";

function mapProduct(product: {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  featured: boolean;
  inventory: number;
  category: { name: string };
  images: { id: string; url: string; alt: string }[];
}): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price / 100,
    featured: product.featured,
    inventory: product.inventory,
    category: product.category.name,
    images: product.images
  };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { featured: true, active: true },
      include: { category: true, images: { orderBy: { position: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: 6
    });
    if (!rows.length) {
      return altFeaturedProducts;
    }
    return rows.map(mapProduct);
  } catch {
    return altFeaturedProducts;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { active: true },
      include: { category: true, images: { orderBy: { position: "asc" } } },
      orderBy: { createdAt: "desc" }
    });
    if (!rows.length) {
      return altFeaturedProducts;
    }
    return rows.map(mapProduct);
  } catch {
    return altFeaturedProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const row = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, images: { orderBy: { position: "asc" } } }
    });
    return row ? mapProduct(row) : null;
  } catch {
    return altFeaturedProducts.find((product) => product.slug === slug) ?? null;
  }
}
