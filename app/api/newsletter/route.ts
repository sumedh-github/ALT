import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = newsletterSchema.parse(body);
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: payload.email }
    });

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: payload.email },
      update: {
        isActive: true
      },
      create: {
        email: payload.email,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

    return NextResponse.json(
      { subscriber, subscribed: !existing },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please provide a valid email." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to subscribe right now." },
      { status: 500 }
    );
  }
}
