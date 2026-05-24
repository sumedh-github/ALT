export type ProductImage = {
  id: string;
  url: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  featured: boolean;
  inventory: number;
  category: string;
  images: ProductImage[];
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  size: string;
  price: number;
  image: string;
};

export type CheckoutPayload = {
  items: CartItem[];
  email: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
};
