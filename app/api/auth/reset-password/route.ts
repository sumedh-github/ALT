import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed." }, { status: 400 });
    }

    const { token, password } = parsed.data;

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      select: { id: true, userId: true, expiresAt: true }
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Reset token is invalid or expired." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
        select: { id: true }
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
        select: { id: true }
      })
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unable to reset password." }, { status: 500 });
  }
}
