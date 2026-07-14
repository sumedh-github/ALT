import { TheoryCardGrid } from "@/components/alt/theory-card-grid";
import { PageReveal } from "@/components/alt/page-reveal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Theories | Avero Loose Theory"
};

export default async function TheoriesPage() {
  const theoriesRaw = await prisma.theory.findMany({
    where: { active: true },
    include: {
      products: {
        select: { productId: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const theories = theoriesRaw.map((theory) => ({
    id: theory.id,
    slug: theory.slug,
    number: theory.number,
    name: theory.name,
    tagline: theory.tagline ?? "",
    description: theory.description,
    image: theory.image,
    productIds: theory.products.map((item) => item.productId),
    season: theory.season ?? "",
    year: theory.year ?? new Date().getFullYear()
  }));

  return (
    <div className="space-y-10 pb-10">
      <PageReveal>
        <section className="-mx-4 border-y border-surface bg-[#141923] px-4 py-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="grid gap-6 md:grid-cols-[1fr_0.7fr] md:items-end">
            <h1 className="font-display text-[clamp(3rem,8vw,6.2rem)] leading-[0.85] text-text">
              THE THEORIES
            </h1>
            <p className="max-w-sm font-body text-sm leading-relaxed text-muted md:justify-self-end md:pr-2">
              Each drop is a world. Enter yours.
            </p>
          </div>
        </section>
      </PageReveal>

      <TheoryCardGrid theories={theories} />
    </div>
  );
}
