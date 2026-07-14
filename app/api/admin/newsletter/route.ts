import { NextRequest, NextResponse } from "next/server";

import { requireAdminRoute } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function toCsv(rows: Array<{ email: string; createdAt: Date }>) {
  const header = "email,createdAt";
  const body = rows
    .map((row) => `${row.email},${row.createdAt.toISOString()}`)
    .join("\n");
  return `${header}\n${body}`;
}

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

    if (request.nextUrl.searchParams.get("format") === "csv") {
      return new NextResponse(
        toCsv(
          subscribers.map((subscriber) => ({
            email: subscriber.email,
            createdAt: subscriber.createdAt
          }))
        ),
        {
          status: 200,
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": 'attachment; filename="newsletter-subscribers.csv"'
          }
        }
      );
    }

    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load newsletter subscribers." },
      { status: 500 }
    );
  }
}
