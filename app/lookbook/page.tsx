import Image from "next/image";
import Link from "next/link";

import { PageReveal } from "@/components/alt/page-reveal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Lookbook | Avero Loose Theory"
};

export default async function LookbookPage() {
  const entries = await prisma.lookbookEntry.findMany({
    where: { active: true },
    include: {
      product: {
        select: {
          slug: true
        }
      }
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }]
  });

  return (
    <div className="space-y-10 pb-10">
      <PageReveal className="space-y-5 pl-2 sm:pl-8 lg:pl-16">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-taupe">
          ALT Lookbook
        </p>
        <h1 className="font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.88] text-text">
          Volume Studies
        </h1>
        <p className="max-w-2xl font-body text-sm leading-relaxed text-taupe">
          A live editorial feed from ALT&apos;s admin studio. Every frame is
          controlled from the internal panel and reflects the active campaign set.
        </p>
      </PageReveal>

      <section className="grid gap-5 md:grid-cols-2">
        {entries.map((entry, index) => (
          <PageReveal key={entry.id} delay={0.08 + index * 0.04}>
            <article className="group space-y-3 rounded-sm border border-surface bg-surface/20 p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#11161f]">
                <Image
                  src={entry.imageUrl}
                  alt={entry.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-4xl leading-[0.9] text-text">
                  {entry.title}
                </h2>
                {entry.subtitle ? (
                  <p className="font-body text-sm text-taupe">{entry.subtitle}</p>
                ) : null}
                {entry.product ? (
                  <Link
                    href={`/shop/${entry.product.slug}`}
                    className="font-body text-xs uppercase tracking-[0.22em] text-gold transition hover:text-taupe"
                  >
                    Shop this look
                  </Link>
                ) : null}
              </div>
            </article>
          </PageReveal>
        ))}
      </section>

      {!entries.length ? (
        <PageReveal delay={0.1}>
          <section className="rounded-sm border border-surface bg-surface/20 px-5 py-8">
            <p className="font-body text-sm text-taupe">
              No active lookbook entries yet. Add them from the admin lookbook panel.
            </p>
          </section>
        </PageReveal>
      ) : null}

      <PageReveal delay={0.22}>
        <section className="-mx-4 border-t border-surface bg-[#10161f] px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-2xl font-display text-4xl italic leading-[0.95] text-text">
              Built to present the brand at investor, buyer, and partner tables.
            </p>
            <Link
              href="/shop"
              className="font-body text-xs uppercase tracking-[0.24em] text-gold transition hover:text-taupe"
            >
              View Product Catalogue
            </Link>
          </div>
        </section>
      </PageReveal>
    </div>
  );
}
