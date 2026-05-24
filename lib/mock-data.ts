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
    slug: "cinder-heavyweight-hoodie",
    name: "Cinder Heavyweight Hoodie",
    description:
      "Ultra-heavy oversized hoodie with compressed rib trims and extra volume through chest and sleeves for architectural presence.",
    shortDescription: "Ultra-heavy hoodie with sculpted oversized body.",
    price: 228,
    inventory: 18,
    featured: true,
    categoryId: "cat-hoodies",
    images: [
      {
        id: "prod-05-image-1",
        url: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1200&q=80",
        alt: "Cinder oversized heavyweight hoodie"
      }
    ]
  },
  {
    id: "prod-06",
    slug: "ash-drape-zip-hoodie",
    name: "Ash Drape Zip Hoodie",
    description:
      "Oversized zip hoodie in washed ash with dropped armhole and long torso balance, ideal for open-layer styling.",
    shortDescription: "Washed ash zip hoodie with oversized drape.",
    price: 248,
    inventory: 15,
    featured: false,
    categoryId: "cat-hoodies",
    images: [
      {
        id: "prod-06-image-1",
        url: "https://images.unsplash.com/photo-1593032465171-8bd2f73fcf7c?auto=format&fit=crop&w=1200&q=80",
        alt: "Ash oversized zip hoodie in shadow"
      }
    ]
  },
  {
    id: "prod-07",
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
        id: "prod-07-image-1",
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
        alt: "Black oversized t-shirt with wide shoulder cut"
      }
    ]
  },
  {
    id: "prod-08",
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
        id: "prod-08-image-1",
        url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=80",
        alt: "Oversized washed black t-shirt on model"
      }
    ]
  },
  {
    id: "prod-09",
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
        id: "prod-09-image-1",
        url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80",
        alt: "Deep charcoal oversized drape t-shirt"
      }
    ]
  },
  {
    id: "prod-10",
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
        id: "prod-10-image-1",
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80",
        alt: "Faded bone oversized t-shirt in studio"
      }
    ]
  },
  {
    id: "prod-11",
    slug: "graphite-panel-oversized-tee",
    name: "Graphite Panel Oversized Tee",
    description:
      "Panel-seamed oversized tee with dense cotton shell and broad neckline construction for strong layered profile.",
    shortDescription: "Panel-seamed oversized tee in graphite tone.",
    price: 105,
    inventory: 26,
    featured: true,
    categoryId: "cat-tshirts",
    images: [
      {
        id: "prod-11-image-1",
        url: "https://images.unsplash.com/photo-1559582798-678dfc71ccd8?auto=format&fit=crop&w=1200&q=80",
        alt: "Graphite oversized panel t-shirt"
      }
    ]
  },
  {
    id: "prod-12",
    slug: "muted-taupe-oversized-tee",
    name: "Muted Taupe Oversized Tee",
    description:
      "Soft-washed oversized tee in warm taupe with wide body block and subtle shoulder extension for effortless drape.",
    shortDescription: "Warm taupe oversized tee with soft washed finish.",
    price: 99,
    inventory: 33,
    featured: false,
    categoryId: "cat-tshirts",
    images: [
      {
        id: "prod-12-image-1",
        url: "https://images.unsplash.com/photo-1618677831708-0e7fda314f4b?auto=format&fit=crop&w=1200&q=80",
        alt: "Muted taupe oversized tee with relaxed fit"
      }
    ]
  },
  {
    id: "prod-13",
    slug: "phantom-layer-oversized-tee",
    name: "Phantom Layer Oversized Tee",
    description:
      "Two-tone layered oversized tee with floating under-hem detail and dropped shoulder geometry.",
    shortDescription: "Layered oversized tee with floating hem detail.",
    price: 102,
    inventory: 28,
    featured: false,
    categoryId: "cat-tshirts",
    images: [
      {
        id: "prod-13-image-1",
        url: "https://images.unsplash.com/photo-1618354691321-e851c56960d1?auto=format&fit=crop&w=1200&q=80",
        alt: "Phantom layered oversized tee"
      }
    ]
  },
  {
    id: "prod-14",
    slug: "blackstone-split-hem-tee",
    name: "Blackstone Split Hem Tee",
    description:
      "Oversized t-shirt with side split hem and long sleeve pitch, designed for movement over stacked trousers.",
    shortDescription: "Split-hem oversized tee with long sleeve pitch.",
    price: 110,
    inventory: 22,
    featured: true,
    categoryId: "cat-tshirts",
    images: [
      {
        id: "prod-14-image-1",
        url: "https://images.unsplash.com/photo-1603252109360-909baaf261c7?auto=format&fit=crop&w=1200&q=80",
        alt: "Blackstone oversized split hem tee"
      }
    ]
  },
  {
    id: "prod-15",
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
        id: "prod-15-image-1",
        url: "https://images.unsplash.com/photo-1594938328870-9623159c8c99?auto=format&fit=crop&w=1200&q=80",
        alt: "Oversized black poplin shirt with sharp structure"
      }
    ]
  },
  {
    id: "prod-16",
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
        id: "prod-16-image-1",
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
        alt: "Taupe oversized button-up shirt"
      }
    ]
  },
  {
    id: "prod-17",
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
        id: "prod-17-image-1",
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
        alt: "Oversized striped shirt with dark tailoring"
      }
    ]
  },
  {
    id: "prod-18",
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
        id: "prod-18-image-1",
        url: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=80",
        alt: "Midnight oversized overshirt layered over tee"
      }
    ]
  },
  {
    id: "prod-19",
    slug: "charcoal-longline-shirt",
    name: "Charcoal Longline Shirt",
    description:
      "Longline oversized shirt in dark charcoal weave with dropped shoulder profile and softened curved hem.",
    shortDescription: "Longline oversized shirt in charcoal weave.",
    price: 176,
    inventory: 21,
    featured: false,
    categoryId: "cat-shirts",
    images: [
      {
        id: "prod-19-image-1",
        url: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?auto=format&fit=crop&w=1200&q=80",
        alt: "Charcoal longline oversized shirt"
      }
    ]
  },
  {
    id: "prod-20",
    slug: "onyx-collarless-oversized-shirt",
    name: "Onyx Collarless Oversized Shirt",
    description:
      "Collarless oversized shirt with clean placket and generous body width, made for minimal layered styling.",
    shortDescription: "Collarless oversized shirt in onyx tone.",
    price: 168,
    inventory: 23,
    featured: false,
    categoryId: "cat-shirts",
    images: [
      {
        id: "prod-20-image-1",
        url: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=1200&q=80",
        alt: "Onyx collarless oversized shirt with minimal cut"
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
      { productId: "prod-07", size: "XL", quantity: 2, unitPrice: 95 },
      { productId: "prod-16", size: "M", quantity: 1, unitPrice: 158 }
    ]
  },
  {
    id: "ord-1002",
    customerName: "Riley Knox",
    email: "riley.knox@clientmail.com",
    status: "shipped",
    createdAt: "2026-05-14",
    total: 499,
    items: [
      { productId: "prod-02", size: "M", quantity: 1, unitPrice: 210 },
      { productId: "prod-08", size: "L", quantity: 2, unitPrice: 89 },
      { productId: "prod-11", size: "L", quantity: 1, unitPrice: 105 }
    ]
  },
  {
    id: "ord-1003",
    customerName: "Avery Lane",
    email: "avery.lane@clientmail.com",
    status: "processing",
    createdAt: "2026-05-20",
    total: 591,
    items: [
      { productId: "prod-04", size: "XL", quantity: 1, unitPrice: 235 },
      { productId: "prod-15", size: "L", quantity: 1, unitPrice: 165 },
      { productId: "prod-10", size: "M", quantity: 1, unitPrice: 92 },
      { productId: "prod-12", size: "L", quantity: 1, unitPrice: 99 }
    ]
  },
  {
    id: "ord-1004",
    customerName: "Morgan Price",
    email: "morgan.price@clientmail.com",
    status: "processing",
    createdAt: "2026-05-23",
    total: 546,
    items: [
      { productId: "prod-06", size: "M", quantity: 1, unitPrice: 248 },
      { productId: "prod-18", size: "L", quantity: 1, unitPrice: 188 },
      { productId: "prod-14", size: "XL", quantity: 1, unitPrice: 110 }
    ]
  }
];
