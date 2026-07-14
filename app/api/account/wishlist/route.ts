import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { requireAccountUserRoute } from "@/lib/account-auth";
import { getUserWishlistEntries } from "@/lib/db/account";
import { prisma } from "@/lib/prisma";
import { wishlistMutationSchema } from "@/lib/validations/account";

export async function GET() {
  const accountCheck = await requireAccountUserRoute();
  if (!accountCheck.ok) {
    return accountCheck.response;
  }

  try {
    const items = await getUserWishlistEntries(accountCheck.userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load wishlist." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const accountCheck = await requireAccountUserRoute();
  if (!accountCheck.ok) {
    return accountCheck.response;
  }

  try {
    const payload = await request.json();
    const parsed = wishlistMutationSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId },
      select: {
        id: true,
        status: true
      }
    });

    if (!product || product.status !== "ACTIVE") {
      return NextResponse.json({ error: "Product not available." }, { status: 404 });
    }

    await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: accountCheck.userId,
          productId: product.id
        }
      },
      update: {},
      create: {
        userId: accountCheck.userId,
        productId: product.id
      }
    });

    const items = await getUserWishlistEntries(accountCheck.userId);

    revalidatePath("/account");
    revalidatePath("/wishlist");
    revalidatePath("/admin/customers/[id]", "page");
    revalidatePath(`/admin/customers/${accountCheck.userId}`);

    return NextResponse.json({ items }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update wishlist." }, { status: 500 });
  }
}
