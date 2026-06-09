import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { requireAccountUserRoute } from "@/lib/account-auth";
import { getUserWishlistEntries } from "@/lib/db/account";
import { prisma } from "@/lib/prisma";

interface WishlistDeleteContext {
  params: {
    productId: string;
  };
}

export async function DELETE(_request: NextRequest, { params }: WishlistDeleteContext) {
  const accountCheck = await requireAccountUserRoute();
  if (!accountCheck.ok) {
    return accountCheck.response;
  }

  try {
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: accountCheck.userId,
        productId: params.productId
      }
    });

    const items = await getUserWishlistEntries(accountCheck.userId);

    revalidatePath("/account");
    revalidatePath("/wishlist");
    revalidatePath("/admin/customers/[id]", "page");
    revalidatePath(`/admin/customers/${accountCheck.userId}`);

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to remove wishlist item." }, { status: 500 });
  }
}
