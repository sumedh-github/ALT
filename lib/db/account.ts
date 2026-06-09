import type { Prisma } from "@prisma/client";

import { formatAddressName } from "@/lib/account-utils";
import { prisma } from "@/lib/prisma";
import type {
  AccountAddressData,
  AccountOrderData,
  AccountProfileData,
  AccountWishlistEntry
} from "@/types/account";
import type { DBProduct } from "@/types/product";

const accountOrderInclude = {
  items: {
    include: {
      product: {
        include: {
          images: {
            orderBy: {
              position: "asc"
            }
          }
        }
      }
    }
  },
  address: true
} satisfies Prisma.OrderInclude;

const wishlistProductInclude = {
  images: {
    orderBy: {
      position: "asc"
    }
  },
  variants: true,
  category: true
} satisfies Prisma.ProductInclude;

export async function getUserProfile(userId: string): Promise<AccountProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      accounts: {
        select: {
          provider: true
        }
      }
    }
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name ?? "ALT Member",
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    emailManagedByGoogle: user.accounts.some((account) => account.provider === "google")
  };
}

export async function getUserOrdersWithDetails(userId: string): Promise<AccountOrderData[]> {
  return prisma.order.findMany({
    where: { userId },
    include: accountOrderInclude,
    orderBy: { createdAt: "desc" }
  });
}

export async function getUserAddresses(userId: string): Promise<AccountAddressData[]> {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }]
  });

  return addresses.map((address) => ({
    id: address.id,
    name: formatAddressName(address.firstName, address.lastName),
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    zip: address.postalCode,
    country: address.country,
    isDefault: address.isDefault
  }));
}

export async function getUserWishlistEntries(userId: string): Promise<AccountWishlistEntry[]> {
  return prisma.wishlistItem.findMany({
    where: {
      userId,
      product: {
        status: "ACTIVE"
      }
    },
    include: {
      product: {
        include: wishlistProductInclude
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getUserWishlistProducts(userId: string): Promise<DBProduct[]> {
  const entries = await getUserWishlistEntries(userId);
  return entries.map((entry) => entry.product);
}

export async function getAccountPageData(userId: string) {
  const [profile, orders, addresses, wishlistProducts] = await Promise.all([
    getUserProfile(userId),
    getUserOrdersWithDetails(userId),
    getUserAddresses(userId),
    getUserWishlistProducts(userId)
  ]);

  return {
    profile,
    orders,
    addresses,
    wishlistProducts
  };
}

export async function getAdminCustomerDetail(customerId: string) {
  return prisma.user.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      addresses: {
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }]
      },
      wishlistItems: {
        select: { id: true }
      },
      orders: {
        include: {
          items: {
            select: {
              id: true,
              quantity: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });
}

export async function ensureDefaultAddress(userId: string) {
  const defaultAddress = await prisma.address.findFirst({
    where: { userId, isDefault: true },
    select: { id: true }
  });

  if (defaultAddress) {
    return defaultAddress.id;
  }

  const nextAddress = await prisma.address.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { id: true }
  });

  if (!nextAddress) {
    return null;
  }

  await prisma.address.update({
    where: { id: nextAddress.id },
    data: { isDefault: true }
  });

  return nextAddress.id;
}
