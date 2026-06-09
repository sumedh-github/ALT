import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ProductStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set for seeding.");
}

const adapter = new PrismaPg(
  new Pool({
    connectionString: databaseUrl
  })
);

const prisma = new PrismaClient({ adapter });

const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const categorySeeds = [
  {
    name: "Oversized Hoodies",
    slug: "oversized-hoodies",
    description: "Heavy fleece silhouettes with deliberate volume."
  },
  {
    name: "Oversized T-Shirts",
    slug: "oversized-tshirts",
    description: "Wide jersey cuts designed for layered drape."
  },
  {
    name: "Oversized Shirts",
    slug: "oversized-shirts",
    description: "Relaxed woven forms with editorial structure."
  }
];

const theorySeeds = [
  {
    slug: "the-void-drop",
    number: "THEORY 001",
    name: "The Void Drop",
    tagline: "Silence shaped in black-on-black volume.",
    description:
      "A study in negative space and muted structure. The Void Drop strips noise from the silhouette and lets proportion speak first.",
    image: "https://picsum.photos/seed/theory-001/1200/800",
    season: "Fall",
    year: 2026
  },
  {
    slug: "concrete-season",
    number: "THEORY 002",
    name: "Concrete Season",
    tagline: "Urban grain, raw texture, cold grey rhythm.",
    description:
      "Concrete Season borrows from wet streets, steel facades, and unfinished walls. Oversized forms are cut to feel architectural and grounded.",
    image: "https://picsum.photos/seed/theory-002/1200/800",
    season: "Winter",
    year: 2026
  },
  {
    slug: "warm-static",
    number: "THEORY 003",
    name: "Warm Static",
    tagline: "Layered comfort charged with quiet heat.",
    description:
      "Warm Static introduces softer tones and heavier stacking. It is built for oversized comfort without losing the ALT edge.",
    image: "https://picsum.photos/seed/theory-003/1200/800",
    season: "Pre-Spring",
    year: 2027
  }
];

const productSeeds = [
  {
    name: "Obsidian Oversized Hoodie",
    slug: "obsidian-oversized-hoodie",
    description:
      "Heavy brushed fleece hoodie with dropped shoulders, elongated sleeves, and a deep structured hood for controlled oversized shape.",
    shortDescription: "Heavy fleece. Elongated drape. Quiet dominance.",
    price: 220,
    featured: true,
    categorySlug: "oversized-hoodies",
    image: "https://images.unsplash.com/photo-1609873814058-a8928924184a?auto=format&fit=crop&w=900&q=80",
    theories: ["the-void-drop"]
  },
  {
    name: "Charcoal Volume Hoodie",
    slug: "charcoal-volume-hoodie",
    description:
      "Dense loopback cotton hoodie with boxy torso and extended cuff length, engineered to sit wide over tees and shirting layers.",
    shortDescription: "Box hoodie with weighted oversized volume.",
    price: 210,
    featured: true,
    categorySlug: "oversized-hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
    theories: ["concrete-season"]
  },
  {
    name: "Gold Stitch Oversized Tee",
    slug: "gold-stitch-oversized-tee",
    description:
      "Dense cotton jersey t-shirt cut with wide body and dropped shoulder line, finished with tonal gold stitch detailing at neck.",
    shortDescription: "Dense jersey oversized tee with tonal stitch.",
    price: 95,
    featured: true,
    categorySlug: "oversized-tshirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    theories: ["the-void-drop", "concrete-season"]
  },
  {
    name: "Muted Taupe Oversized Tee",
    slug: "muted-taupe-oversized-tee",
    description:
      "Soft-washed oversized tee in warm taupe with wide body block and subtle shoulder extension for effortless drape.",
    shortDescription: "Warm taupe oversized tee with soft washed finish.",
    price: 99,
    featured: false,
    categorySlug: "oversized-tshirts",
    image: "https://images.unsplash.com/photo-1618677831708-0e7fda314f4b?auto=format&fit=crop&w=900&q=80",
    theories: ["warm-static"]
  },
  {
    name: "Obsidian Oversized Poplin Shirt",
    slug: "obsidian-oversized-poplin-shirt",
    description:
      "Crisp poplin shirt with oversized torso, dropped shoulders, and longer cuff profile, made for sharp layered silhouettes.",
    shortDescription: "Oversized poplin shirt with long clean lines.",
    price: 165,
    featured: true,
    categorySlug: "oversized-shirts",
    image: "https://images.unsplash.com/photo-1594938328870-9623159c8c99?auto=format&fit=crop&w=900&q=80",
    theories: ["warm-static", "the-void-drop"]
  }
];

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const customerPassword = await bcrypt.hash("Test@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@averolosetheory.com" },
    update: {
      name: "ALT Admin",
      password: adminPassword,
      role: Role.ADMIN
    },
    create: {
      name: "ALT Admin",
      email: "admin@averolosetheory.com",
      password: adminPassword,
      role: Role.ADMIN
    }
  });

  await prisma.user.upsert({
    where: { email: "customer@test.com" },
    update: {
      name: "ALT Customer",
      password: customerPassword,
      role: Role.CUSTOMER
    },
    create: {
      name: "ALT Customer",
      email: "customer@test.com",
      password: customerPassword,
      role: Role.CUSTOMER
    }
  });

  for (const category of categorySeeds) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  for (const theory of theorySeeds) {
    await prisma.theory.upsert({
      where: { slug: theory.slug },
      update: theory,
      create: theory
    });
  }

  for (const productSeed of productSeeds) {
    const category = await prisma.category.findUnique({
      where: { slug: productSeed.categorySlug }
    });

    if (!category) {
      throw new Error(`Category not found: ${productSeed.categorySlug}`);
    }

    const product = await prisma.product.upsert({
      where: { slug: productSeed.slug },
      update: {
        name: productSeed.name,
        description: productSeed.description,
        shortDescription: productSeed.shortDescription,
        price: productSeed.price,
        featured: productSeed.featured,
        status: ProductStatus.ACTIVE,
        categoryId: category.id
      },
      create: {
        name: productSeed.name,
        slug: productSeed.slug,
        description: productSeed.description,
        shortDescription: productSeed.shortDescription,
        price: productSeed.price,
        featured: productSeed.featured,
        status: ProductStatus.ACTIVE,
        categoryId: category.id
      }
    });

    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    });

    await prisma.productVariant.deleteMany({
      where: { productId: product.id }
    });

    await prisma.theoryProduct.deleteMany({
      where: { productId: product.id }
    });

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: productSeed.image,
        alt: `${productSeed.name} seed image`,
        position: 0
      }
    });

    await prisma.productVariant.createMany({
      data: sizes.map((size) => ({
        productId: product.id,
        size,
        sku: `ALT-${productSeed.slug.toUpperCase().replace(/[^A-Z0-9]/g, "-")}-${size}`,
        inventory: 10,
        price: productSeed.price
      }))
    });

    let position = 0;
    for (const theorySlug of productSeed.theories) {
      const theory = await prisma.theory.findUnique({
        where: { slug: theorySlug }
      });

      if (!theory) {
        throw new Error(`Theory not found: ${theorySlug}`);
      }

      await prisma.theoryProduct.create({
        data: {
          theoryId: theory.id,
          productId: product.id,
          position
        }
      });

      position += 1;
    }
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
