import type { Product } from "@/types";

export const altFeaturedProducts: Product[] = [
  {
    id: "alt-1",
    slug: "obsidian-drape-hoodie",
    name: "Obsidian Drape Hoodie",
    description:
      "Heavyweight brushed fleece with elongated sleeves, dropped shoulder architecture, and a structured hood engineered for layered silhouettes.",
    shortDescription: "Heavy fleece. Elongated drape. Structured silence.",
    price: 220,
    featured: true,
    inventory: 24,
    category: "Outerwear",
    images: [
      {
        id: "alt-1-image-1",
        url: "https://res.cloudinary.com/demo/image/upload/v1720000000/alt-hoodie.jpg",
        alt: "Model in obsidian drape hoodie"
      }
    ]
  },
  {
    id: "alt-2",
    slug: "taupe-wide-leg-cargo",
    name: "Taupe Wide Leg Cargo",
    description:
      "Double-pleat volume cargo trouser in washed taupe twill, featuring hidden side cinches and raw edge hems for editorial movement.",
    shortDescription: "Wide volume cargos with hidden cinch tension.",
    price: 240,
    featured: true,
    inventory: 16,
    category: "Bottoms",
    images: [
      {
        id: "alt-2-image-1",
        url: "https://res.cloudinary.com/demo/image/upload/v1720000000/alt-cargo.jpg",
        alt: "Taupe wide leg cargo trouser"
      }
    ]
  },
  {
    id: "alt-3",
    slug: "gold-stitch-box-tee",
    name: "Gold Stitch Box Tee",
    description:
      "Dense cotton jersey tee with a box cut and tonal embroidery at the back neck. Built for clean stacking under oversized outer layers.",
    shortDescription: "Dense jersey box tee with tonal ALT mark.",
    price: 95,
    featured: true,
    inventory: 36,
    category: "Tops",
    images: [
      {
        id: "alt-3-image-1",
        url: "https://res.cloudinary.com/demo/image/upload/v1720000000/alt-tee.jpg",
        alt: "Gold stitch box tee detail"
      }
    ]
  }
];
