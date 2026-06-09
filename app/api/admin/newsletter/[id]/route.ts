import { NextResponse } from "next/server";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

interface NewsletterRouteProps {
  params: {
    id: string;
  };
}

export async function DELETE(_: Request, { params }: NewsletterRouteProps) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    await prisma.newsletterSubscriber.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete subscriber." },
      { status: 500 }
    );
  }
}
