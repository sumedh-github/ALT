export interface AltCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface AltProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface AltProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  inventory: number;
  featured: boolean;
  categoryId: string;
  images: AltProductImage[];
}

export interface AltOrderItem {
  productId: string;
  size: "XS" | "S" | "M" | "L" | "XL";
  quantity: number;
  unitPrice: number;
}

export interface AltOrder {
  id: string;
  customerName: string;
  email: string;
  status: "processing" | "shipped" | "delivered";
  createdAt: string;
  total: number;
  items: AltOrderItem[];
}

export const altCategories: AltCategory[] = [
  {
    id: "cat-outerwear",
    name: "Outerwear",
    slug: "outerwear",
    description: "Weight-driven layers cut for oversized structure."
  },
  {
    id: "cat-tops",
    name: "Tops",
    slug: "tops",
    description: "Dense jersey forms built for calm proportion."
  },
  {
    id: "cat-bottoms",
    name: "Bottoms",
    slug: "bottoms",
    description: "Wide-leg systems with architectural drape."
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Functional details in muted luxury tones."
  }
];

export const altProducts: AltProduct[] = [
  {
    id: "prod-01",
    slug: "obsidian-drape-hoodie",
    name: "Obsidian Drape Hoodie",
    description:
      "Heavy brushed fleece hoodie with elongated sleeve reach, dropped shoulders, and a precise hood structure for stacked silhouettes.",
    shortDescription: "Heavy fleece. Elongated drape. Quiet dominance.",
    price: 220,
    inventory: 24,
    featured: true,
    categoryId: "cat-outerwear",
    images: [
      {
        id: "prod-01-image-1",
        url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80",
        alt: "Obsidian drape hoodie in shadow studio light"
      }
    ]
  },
  {
    id: "prod-02",
    slug: "charcoal-veil-trench",
    name: "Charcoal Veil Trench",
    description:
      "Floor-length trench in matte technical twill with concealed placket and broad shoulder line for editorial movement.",
    shortDescription: "Long veil trench with muted structure.",
    price: 340,
    inventory: 10,
    featured: true,
    categoryId: "cat-outerwear",
    images: [
      {
        id: "prod-02-image-1",
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
        alt: "Charcoal trench coat with long line drape"
      }
    ]
  },
  {
    id: "prod-03",
    slug: "gold-stitch-box-tee",
    name: "Gold Stitch Box Tee",
    description:
      "Dense cotton jersey tee cut with a cropped box frame and tonal gold neck stitch signature for restrained contrast.",
    shortDescription: "Dense jersey box cut with tonal mark.",
    price: 95,
    inventory: 38,
    featured: true,
    categoryId: "cat-tops",
    images: [
      {
        id: "prod-03-image-1",
        url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=80",
        alt: "ALT box tee with tonal gold stitch detail"
      }
    ]
  },
  {
    id: "prod-04",
    slug: "midnight-layer-longsleeve",
    name: "Midnight Layer Longsleeve",
    description:
      "Stretch-structured jersey base layer with elongated body and sleeves designed for tonal stacking under oversized shells.",
    shortDescription: "Layer-first longsleeve with extended reach.",
    price: 115,
    inventory: 29,
    featured: false,
    categoryId: "cat-tops",
    images: [
      {
        id: "prod-04-image-1",
        url: "https://images.unsplash.com/photo-1618354691417-a55f2ee0c695?auto=format&fit=crop&w=1200&q=80",
        alt: "Midnight layer longsleeve in editorial pose"
      }
    ]
  },
  {
    id: "prod-05",
    slug: "taupe-wide-leg-cargo",
    name: "Taupe Wide Leg Cargo",
    description:
      "Double-pleat volume cargo trouser in washed taupe twill, finished with hidden cinch channels and raw edge hem depth.",
    shortDescription: "Wide volume cargo with hidden cinch tension.",
    price: 240,
    inventory: 16,
    featured: true,
    categoryId: "cat-bottoms",
    images: [
      {
        id: "prod-05-image-1",
        url: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?auto=format&fit=crop&w=1200&q=80",
        alt: "Taupe wide leg cargo with stacked hem"
      }
    ]
  },
  {
    id: "prod-06",
    slug: "onyx-structured-jogger",
    name: "Onyx Structured Jogger",
    description:
      "Weighted jogger silhouette with forward seam articulation, matte hardware, and controlled taper from knee to cuff.",
    shortDescription: "Structured jogger in muted onyx tone.",
    price: 185,
    inventory: 21,
    featured: false,
    categoryId: "cat-bottoms",
    images: [
      {
        id: "prod-06-image-1",
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
        alt: "Onyx structured jogger with panel seam lines"
      }
    ]
  },
  {
    id: "prod-07",
    slug: "aged-gold-chain-wallet",
    name: "Aged Gold Chain Wallet",
    description:
      "Compact leather wallet with matte chain and concealed magnetic fold, finished in softly distressed dark taupe.",
    shortDescription: "Compact wallet with muted gold chain.",
    price: 140,
    inventory: 18,
    featured: false,
    categoryId: "cat-accessories",
    images: [
      {
        id: "prod-07-image-1",
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
        alt: "Leather chain wallet laid on charcoal fabric"
      }
    ]
  },
  {
    id: "prod-08",
    slug: "silent-volume-beanie",
    name: "Silent Volume Beanie",
    description:
      "Dense rib knit beanie with extended crown profile and folded edge, made to sit deep with oversized outer layers.",
    shortDescription: "Dense rib beanie with extended crown.",
    price: 68,
    inventory: 42,
    featured: false,
    categoryId: "cat-accessories",
    images: [
      {
        id: "prod-08-image-1",
        url: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1200&q=80",
        alt: "Dark knit beanie with textured volume"
      }
    ]
  }
];

export const altOrders: AltOrder[] = [
  {
    id: "ord-1001",
    customerName: "Jordan Hale",
    email: "jordan.hale@clientmail.com",
    status: "delivered",
    createdAt: "2026-05-02",
    total: 560,
    items: [
      { productId: "prod-01", size: "L", quantity: 1, unitPrice: 220 },
      { productId: "prod-05", size: "M", quantity: 1, unitPrice: 240 },
      { productId: "prod-08", size: "M", quantity: 1, unitPrice: 68 }
    ]
  },
  {
    id: "ord-1002",
    customerName: "Riley Knox",
    email: "riley.knox@clientmail.com",
    status: "shipped",
    createdAt: "2026-05-14",
    total: 455,
    items: [
      { productId: "prod-02", size: "M", quantity: 1, unitPrice: 340 },
      { productId: "prod-04", size: "L", quantity: 1, unitPrice: 115 }
    ]
  },
  {
    id: "ord-1003",
    customerName: "Avery Lane",
    email: "avery.lane@clientmail.com",
    status: "processing",
    createdAt: "2026-05-20",
    total: 323,
    items: [
      { productId: "prod-03", size: "XL", quantity: 1, unitPrice: 95 },
      { productId: "prod-06", size: "L", quantity: 1, unitPrice: 185 },
      { productId: "prod-08", size: "M", quantity: 1, unitPrice: 68 }
    ]
  }
];
