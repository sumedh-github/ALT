import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { requireAccountUserRoute } from "@/lib/account-auth";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "authjs.csrf-token",
  "next-auth.csrf-token"
];

export async function DELETE(_request: NextRequest) {
  const accountCheck = await requireAccountUserRoute();
  if (!accountCheck.ok) {
    return accountCheck.response;
  }

  try {
    await prisma.user.delete({
      where: { id: accountCheck.userId }
    });

    revalidatePath("/");
    revalidatePath("/account");
    revalidatePath("/admin/customers");

    const response = NextResponse.json({ ok: true });
    for (const cookieName of SESSION_COOKIE_NAMES) {
      response.cookies.set(cookieName, "", {
        maxAge: 0,
        expires: new Date(0),
        path: "/"
      });
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete account." }, { status: 500 });
  }
}
