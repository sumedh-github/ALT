import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token }
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  return NextResponse.json({ valid: true }, { status: 200 });
}
