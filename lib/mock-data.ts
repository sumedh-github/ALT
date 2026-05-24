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
    id: "cat-hoodies",
    name: "Oversized Hoodies",
    slug: "oversized-hoodies",
    description: "Heavy fleece silhouettes with deliberate volume."
  },
  {
    id: "cat-tshirts",
    name: "Oversized T-Shirts",
    slug: "oversized-tshirts",
    description: "Wide jersey cuts designed for layered drape."
  },
  {
    id: "cat-shirts",
    name: "Oversized Shirts",
    slug: "oversized-shirts",
    description: "Relaxed woven forms with editorial structure."
  }
];

export const altProducts: AltProduct[] = [
  {
    id: "prod-01",
    slug: "obsidian-oversized-hoodie",
    name: "Obsidian Oversized Hoodie",
    description:
      "Heavy brushed fleece hoodie with dropped shoulders, elongated sleeves, and a deep structured hood for controlled oversized shape.",
    shortDescription: "Heavy fleece. Elongated drape. Quiet dominance.",
    price: 220,
    inventory: 24,
    featured: true,
    categoryId: "cat-hoodies",
    images: [
      {
        id: "prod-01-image-1",
        url: "https://images.unsplash.com/photo-1609873814058-a8928924184a?auto=format&fit=crop&w=1200&q=80",
        alt: "Model wearing oversized black hoodie in studio"
      }
    ]
  },
  {
    id: "prod-02",
    slug: "charcoal-volume-hoodie",
    name: "Charcoal Volume Hoodie",
    description:
      "Dense loopback cotton hoodie with boxy torso and extended cuff length, engineered to sit wide over tees and shirting layers.",
    shortDescription: "Box hoodie with weighted oversized volume.",
    price: 210,
    inventory: 20,
    featured: true,
    categoryId: "cat-hoodies",
    images: [
      {
        id: "prod-02-image-1",
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
        alt: "Charcoal oversized hoodie with heavy silhouette"
      }
    ]
  },
  {
    id: "prod-03",
    slug: "taupe-shadow-hoodie",
    name: "Taupe Shadow Hoodie",
    description:
      "Soft-washed heavyweight hoodie in muted taupe with broad shoulder architecture and long hem fall for dramatic movement.",
    shortDescription: "Muted taupe hoodie with long oversized fall.",
    price: 205,
    inventory: 19,
    featured: false,
    categoryId: "cat-hoodies",
    images: [
      {
        id: "prod-03-image-1",
        url: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1200&q=80",
        alt: "Oversized taupe hoodie with relaxed fit"
      }
    ]
  },
  {
    id: "prod-04",
    slug: "midnight-layer-hoodie",
    name: "Midnight Layer Hoodie",
    description:
      "Double-knit oversized hoodie with split hem and reinforced shoulder seams, built for stacked winter silhouettes.",
    shortDescription: "Double-knit oversized hoodie for stacked layers.",
    price: 235,
    inventory: 14,
    featured: false,
    categoryId: "cat-hoodies",
    images: [
      {
        id: "prod-04-image-1",
        url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=80",
        alt: "Midnight oversized hoodie in dark light"
      }
    ]
  },
  {
    id: "prod-05",
    slug: "gold-stitch-oversized-tee",
    name: "Gold Stitch Oversized Tee",
    description:
      "Dense cotton jersey t-shirt cut with wide body and dropped shoulder line, finished with tonal gold stitch detailing at neck.",
    shortDescription: "Dense jersey oversized tee with tonal stitch.",
    price: 95,
    inventory: 38,
    featured: true,
    categoryId: "cat-tshirts",
    images: [
      {
        id: "prod-05-image-1",
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
        alt: "Black oversized t-shirt with wide shoulder cut"
      }
    ]
  },
  {
    id: "prod-06",
    slug: "washed-onyx-box-tee",
    name: "Washed Onyx Box Tee",
    description:
      "Washed heavyweight t-shirt with square body proportions and longer sleeve reach for clean oversized profile.",
    shortDescription: "Washed box tee in oversized onyx frame.",
    price: 89,
    inventory: 44,
    featured: true,
    categoryId: "cat-tshirts",
    images: [
      {
        id: "prod-06-image-1",
        url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=80",
        alt: "Oversized washed black t-shirt on model"
      }
    ]
  },
  {
    id: "prod-07",
    slug: "deep-charcoal-drape-tee",
    name: "Deep Charcoal Drape Tee",
    description:
      "Fluid oversized t-shirt with softened shoulder drop and elongated body designed to fall cleanly over layered hems.",
    shortDescription: "Draped oversized tee with long fluid body.",
    price: 98,
    inventory: 31,
    featured: false,
    categoryId: "cat-tshirts",
    images: [
      {
        id: "prod-07-image-1",
        url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80",
        alt: "Deep charcoal oversized drape t-shirt"
      }
    ]
  },
  {
    id: "prod-08",
    slug: "bone-wide-cut-tee",
    name: "Bone Wide Cut Tee",
    description:
      "Oversized tee in faded bone tone with broad chest measure and dropped sleeve cap for tonal contrast styling.",
    shortDescription: "Wide oversized tee in faded bone finish.",
    price: 92,
    inventory: 27,
    featured: false,
    categoryId: "cat-tshirts",
    images: [
      {
        id: "prod-08-image-1",
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80",
        alt: "Faded bone oversized t-shirt in studio"
      }
    ]
  },
  {
    id: "prod-09",
    slug: "obsidian-oversized-poplin-shirt",
    name: "Obsidian Oversized Poplin Shirt",
    description:
      "Crisp poplin shirt with oversized torso, dropped shoulders, and longer cuff profile, made for sharp layered silhouettes.",
    shortDescription: "Oversized poplin shirt with long clean lines.",
    price: 165,
    inventory: 22,
    featured: true,
    categoryId: "cat-shirts",
    images: [
      {
        id: "prod-09-image-1",
        url: "https://images.unsplash.com/photo-1594938328870-9623159c8c99?auto=format&fit=crop&w=1200&q=80",
        alt: "Oversized black poplin shirt with sharp structure"
      }
    ]
  },
  {
    id: "prod-10",
    slug: "taupe-relaxed-oxford-shirt",
    name: "Taupe Relaxed Oxford Shirt",
    description:
      "Oversized oxford shirt in soft taupe with broadened shoulder span and editorial hem length.",
    shortDescription: "Relaxed oversized oxford in muted taupe.",
    price: 158,
    inventory: 25,
    featured: true,
    categoryId: "cat-shirts",
    images: [
      {
        id: "prod-10-image-1",
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
        alt: "Taupe oversized button-up shirt"
      }
    ]
  },
  {
    id: "prod-11",
    slug: "shadow-striped-oversized-shirt",
    name: "Shadow Striped Oversized Shirt",
    description:
      "Wide striped woven shirt with low armhole construction and long back body for directional oversized layering.",
    shortDescription: "Striped oversized shirt with directional cut.",
    price: 172,
    inventory: 18,
    featured: false,
    categoryId: "cat-shirts",
    images: [
      {
        id: "prod-11-image-1",
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
        alt: "Oversized striped shirt with dark tailoring"
      }
    ]
  },
  {
    id: "prod-12",
    slug: "midnight-brushed-overshirt",
    name: "Midnight Brushed Overshirt",
    description:
      "Brushed cotton overshirt with oversized fit, reinforced placket, and broad sleeve architecture built for cross-season layering.",
    shortDescription: "Brushed oversized overshirt with broad sleeves.",
    price: 188,
    inventory: 16,
    featured: false,
    categoryId: "cat-shirts",
    images: [
      {
        id: "prod-12-image-1",
        url: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=80",
        alt: "Midnight oversized overshirt layered over tee"
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
    total: 568,
    items: [
      { productId: "prod-01", size: "L", quantity: 1, unitPrice: 220 },
      { productId: "prod-05", size: "XL", quantity: 2, unitPrice: 95 },
      { productId: "prod-10", size: "M", quantity: 1, unitPrice: 158 }
    ]
  },
  {
    id: "ord-1002",
    customerName: "Riley Knox",
    email: "riley.knox@clientmail.com",
    status: "shipped",
    createdAt: "2026-05-14",
    total: 486,
    items: [
      { productId: "prod-02", size: "M", quantity: 1, unitPrice: 210 },
      { productId: "prod-06", size: "L", quantity: 2, unitPrice: 89 },
      { productId: "prod-07", size: "L", quantity: 1, unitPrice: 98 }
    ]
  },
  {
    id: "ord-1003",
    customerName: "Avery Lane",
    email: "avery.lane@clientmail.com",
    status: "processing",
    createdAt: "2026-05-20",
    total: 587,
    items: [
      { productId: "prod-04", size: "XL", quantity: 1, unitPrice: 235 },
      { productId: "prod-09", size: "L", quantity: 1, unitPrice: 165 },
      { productId: "prod-08", size: "M", quantity: 1, unitPrice: 92 },
      { productId: "prod-05", size: "L", quantity: 1, unitPrice: 95 }
    ]
  }
];
