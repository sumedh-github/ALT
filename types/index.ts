export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  size: string;
  price: number;
  image: string;
}

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category?: string;
}

export * from "./account";
