import type { OrderStatus, Role } from "@prisma/client";

import type { DBProduct } from "@/types/product";

export interface AccountProfileData {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  emailManagedByGoogle: boolean;
}

export interface AccountProfileUpdateInput {
  name: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface AccountAddressData {
  id: string;
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface AccountAddressInput {
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface AccountOrderItemData {
  id: string;
  name: string;
  size: string | null;
  quantity: number;
  unitPrice: number;
  product: {
    id: string;
    slug: string;
    name: string;
    images: Array<{
      id: string;
      url: string;
      alt: string | null;
      position: number;
    }>;
  } | null;
}

export interface AccountOrderData {
  id: string;
  createdAt: Date;
  status: OrderStatus;
  trackingNumber: string | null;
  total: number;
  address: {
    id: string;
    firstName: string;
    lastName: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  items: AccountOrderItemData[];
}

export interface AccountWishlistEntry {
  id: string;
  productId: string;
  createdAt: Date;
  product: DBProduct;
}
