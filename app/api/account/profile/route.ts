import bcryptjs from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { requireAccountUserRoute } from "@/lib/account-auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations/account";

export async function PATCH(request: NextRequest) {
  const accountCheck = await requireAccountUserRoute();
  if (!accountCheck.ok) {
    return accountCheck.response;
  }

  const userId = accountCheck.userId;

  try {
    const payload = await request.json();
    const parsed = profileSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        email: true,
        accounts: {
          select: {
            provider: true
          }
        }
      }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const emailManagedByGoogle = existingUser.accounts.some(
      (account) => account.provider === "google"
    );

    if (emailManagedByGoogle && data.email && data.email !== existingUser.email) {
      return NextResponse.json({ error: "Email is managed by Google." }, { status: 400 });
    }

    let nextPassword: string | undefined;
    if (data.newPassword) {
      if (!existingUser.password) {
        return NextResponse.json(
          { error: "Password changes are unavailable for this account." },
          { status: 400 }
        );
      }

      const currentPasswordMatches = await bcryptjs.compare(
        data.currentPassword ?? "",
        existingUser.password
      );

      if (!currentPasswordMatches) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }

      nextPassword = await bcryptjs.hash(data.newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: emailManagedByGoogle ? undefined : data.email ?? existingUser.email,
        password: nextPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    revalidatePath("/account");
    revalidatePath("/admin/customers");
    revalidatePath("/admin/customers/[id]", "page");
    revalidatePath(`/admin/customers/${userId}`);

    return NextResponse.json({
      user: {
        ...updatedUser,
        emailManagedByGoogle
      }
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "Email is already in use." }, { status: 409 });
    }

    console.error(error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
