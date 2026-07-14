import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function requireAdminRoute() {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 })
    };
  }

  return {
    ok: true as const,
    session
  };
}
