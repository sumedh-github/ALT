import { NextResponse } from "next/server";

import { forgotPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  // Production implementation: generate token, persist hash, dispatch email.
  return NextResponse.json({ success: true });
}
