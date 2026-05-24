import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const categories = await Promise.all(
    [
      { name: "Outerwear", slug: "outerwear" },
      { name: "Bottoms", slug: "bottoms" },
      { name: "Tops", slug: "tops" }
    ].map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      })
    )
  );

  const categoryByName = new Map(categories.map((category) => [category.name, category.id]));
  const products = [
    {
      name: "Obsidian Drape Hoodie",
      slug: "obsidian-drape-hoodie",
      description:
        "Heavyweight brushed fleece with elongated sleeves, dropped shoulder architecture, and a structured hood engineered for layered silhouettes.",
      shortDescription: "Heavy fleece. Elongated drape. Structured silence.",
      price: 22000,
      inventory: 24,
      featured: true,
      categoryName: "Outerwear",
      image:
        "https://res.cloudinary.com/demo/image/upload/v1720000000/alt-hoodie.jpg"
    },
    {
      name: "Taupe Wide Leg Cargo",
      slug: "taupe-wide-leg-cargo",
      description:
        "Double-pleat volume cargo trouser in washed taupe twill, featuring hidden side cinches and raw edge hems for editorial movement.",
      shortDescription: "Wide volume cargos with hidden cinch tension.",
      price: 24000,
      inventory: 16,
      featured: true,
      categoryName: "Bottoms",
      image:
        "https://res.cloudinary.com/demo/image/upload/v1720000000/alt-cargo.jpg"
    },
    {
      name: "Gold Stitch Box Tee",
      slug: "gold-stitch-box-tee",
      description:
        "Dense cotton jersey tee with a box cut and tonal embroidery at the back neck. Built for clean stacking under oversized outer layers.",
      shortDescription: "Dense jersey box tee with tonal ALT mark.",
      price: 9500,
      inventory: 36,
      featured: true,
      categoryName: "Tops",
      image: "https://res.cloudinary.com/demo/image/upload/v1720000000/alt-tee.jpg"
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        inventory: product.inventory,
        featured: product.featured,
        categoryId: categoryByName.get(product.categoryName) ?? categories[0].id,
        images: {
          create: [{ url: product.image, alt: product.name, position: 0 }]
        }
      }
    });
  }

  const adminPassword = await bcrypt.hash("AltAdmin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@averoalt.com" },
    update: {},
    create: {
      email: "admin@averoalt.com",
      name: "ALT Admin",
      role: Role.ADMIN,
      passwordHash: adminPassword
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
