import { redirect } from "next/navigation";

import { NewsletterPanel } from "@/components/admin/newsletter-panel";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function exportSubscribersCsvAction() {
  "use server";
  redirect("/api/admin/newsletter?format=csv");
}

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      createdAt: true
    }
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#e2e4ed]">Newsletter</h1>
          <p className="text-sm text-[#6b7280]">
            {subscribers.length} subscribers
          </p>
        </div>
        <form action={exportSubscribersCsvAction}>
          <button
            type="submit"
            className="rounded-md border border-[#2a2d3a] px-4 py-2 text-sm text-[#9ca3af] transition hover:border-[#6366f1] hover:text-[#e2e4ed]"
          >
            Export CSV
          </button>
        </form>
      </header>

      <NewsletterPanel subscribers={subscribers} />
    </div>
  );
}
