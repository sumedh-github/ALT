import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { splitName } from "@/lib/account-utils";
import { requireAccountUserRoute } from "@/lib/account-auth";
import { ensureDefaultAddress, getUserAddresses } from "@/lib/db/account";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations/account";

interface AddressRouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: AddressRouteContext) {
  const accountCheck = await requireAccountUserRoute();
  if (!accountCheck.ok) {
    return accountCheck.response;
  }

  try {
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: accountCheck.userId
      },
      select: {
        id: true
      }
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found." }, { status: 404 });
    }

    const payload = await request.json();
    const parsed = addressSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const { firstName, lastName } = splitName(data.name);

    await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId: accountCheck.userId },
          data: { isDefault: false }
        });
      }

      await tx.address.update({
        where: { id: params.id },
        data: {
          firstName,
          lastName,
          line1: data.line1,
          line2: data.line2 || null,
          city: data.city,
          state: data.state,
          postalCode: data.zip,
          country: data.country,
          isDefault: data.isDefault
        }
      });
    });

    await ensureDefaultAddress(accountCheck.userId);
    const addresses = await getUserAddresses(accountCheck.userId);

    revalidatePath("/account");
    revalidatePath("/admin/customers/[id]", "page");
    revalidatePath(`/admin/customers/${accountCheck.userId}`);

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update address." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: AddressRouteContext) {
  const accountCheck = await requireAccountUserRoute();
  if (!accountCheck.ok) {
    return accountCheck.response;
  }

  try {
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: accountCheck.userId
      },
      select: {
        id: true
      }
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found." }, { status: 404 });
    }

    await prisma.address.delete({
      where: {
        id: params.id
      }
    });

    await ensureDefaultAddress(accountCheck.userId);
    const addresses = await getUserAddresses(accountCheck.userId);

    revalidatePath("/account");
    revalidatePath("/admin/customers/[id]", "page");
    revalidatePath(`/admin/customers/${accountCheck.userId}`);

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete address." }, { status: 500 });
  }
}
