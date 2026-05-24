import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validations/checkout";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid checkout payload." },
      { status: 400 }
    );
  }

  try {
    const origin = process.env.NEXTAUTH_URL ?? new URL(request.url).origin;
    const order = await prisma.order.create({
      data: {
        email: parsed.data.email,
        total: Math.round(
          parsed.data.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ) * 100
        ),
        shippingName: parsed.data.shippingName,
        shippingAddress: parsed.data.shippingAddress,
        shippingCity: parsed.data.shippingCity,
        shippingPostalCode: parsed.data.shippingPostalCode,
        shippingCountry: parsed.data.shippingCountry,
        items: {
          create: parsed.data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            unitPrice: Math.round(item.price * 100)
          }))
        }
      }
    });

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.email,
      line_items: parsed.data.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: `${item.name} / ${item.size}`,
            images: item.image ? [item.image] : undefined
          }
        }
      })),
      success_url: `${origin}/account?checkout=success`,
      cancel_url: `${origin}/checkout?checkout=cancel`,
      metadata: { orderId: order.id }
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id }
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Checkout service is currently unavailable." },
      { status: 500 }
    );
  }
}
