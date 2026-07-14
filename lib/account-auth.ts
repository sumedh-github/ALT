import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function requireAccountUserRoute() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    };
  }

  return {
    ok: true as const,
    session,
    userId: session.user.id
  };
}
