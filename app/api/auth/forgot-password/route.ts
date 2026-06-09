import { randomBytes } from "node:crypto";

import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "ALT <onboarding@resend.dev>",
        to: user.email,
        subject: "ALT Password Reset",
        html: `
          <div style="background:#1a1e24;padding:24px;color:#e8e0d4;font-family:Arial,sans-serif">
            <h2 style="font-weight:500;margin-bottom:12px">Reset Your Access</h2>
            <p style="margin-bottom:16px">Use the link below to set a new password.</p>
            <a href="${resetUrl}" style="color:#c9a96e;text-decoration:none">Reset Password</a>
            <p style="margin-top:16px;color:#b8a898">This link expires in 1 hour.</p>
          </div>
        `
      });
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
