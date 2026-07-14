import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const registerAttempts = new Map<string, number[]>();
const REGISTER_WINDOW_MS = 10 * 60 * 1000;
const REGISTER_MAX_ATTEMPTS = 5;

const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email().max(254),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

function isRateLimited(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recentAttempts = (registerAttempts.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < REGISTER_WINDOW_MS
  );

  recentAttempts.push(now);
  registerAttempts.set(ip, recentAttempts);

  return recentAttempts.length > REGISTER_MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  try {
    if (isRateLimited(request)) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          details: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CUSTOMER"
      },
      select: { id: true }
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to process registration." },
      { status: 500 }
    );
  }
}
