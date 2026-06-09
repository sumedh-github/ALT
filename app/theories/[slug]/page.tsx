import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageReveal } from "@/components/alt/page-reveal";
import { ProductCard } from "@/components/alt/product-card";
import { prisma } from "@/lib/prisma";

interface TheoryDetailPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const theories = await prisma.theory.findMany({
      where: { active: true },
      select: { slug: true }
    });
    return theories.map((theory) => ({ slug: theory.slug }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function TheoryDetailPage({ params }: TheoryDetailPageProps) {
  const theory = await prisma.theory.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        orderBy: { position: "asc" },
        include: {
          product: {
            include: {
              images: {
                orderBy: { position: "asc" }
              },
              variants: true,
              category: true
            }
          }
        }
      }
    }
  });
  if (!theory || !theory.active) {
    notFound();
  }

  const theoryProducts = theory.products
    .map((item) => item.product)
    .filter((product) => product.status === "ACTIVE");

  return (
    <div className="space-y-10 pb-10">
      <PageReveal>
        <section className="-mx-4 overflow-hidden border-y border-surface bg-[#121722] sm:-mx-6 lg:-mx-8">
          <div className="relative h-[68vh] min-h-[460px]">
            <Image
              src={theory.image}
              alt={`${theory.name} hero frame`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute left-5 top-5 font-body text-[11px] uppercase tracking-[0.25em] text-muted sm:left-8 sm:top-8">
              {theory.number}
            </div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 text-center sm:px-10">
              <h1 className="font-display text-6xl leading-[0.85] text-text sm:text-7xl lg:text-8xl">
                {theory.name}
              </h1>
              <p className="mt-4 font-body text-sm italic tracking-[0.05em] text-taupe sm:text-base">
                {theory.tagline ?? "The Oversized Theory"}
              </p>
            </div>
          </div>
        </section>
      </PageReveal>

      <PageReveal delay={0.06}>
        <section className="max-w-3xl pl-1 sm:pl-6 lg:pl-10">
          <p className="font-body text-base leading-relaxed text-taupe">
            {theory.description} Built for {theory.season ?? "ALT Season"}{" "}
            {theory.year ?? new Date().getFullYear()}, this
            Theory carries ALT&apos;s quiet confidence through weighted layers and
            intentional volume.
          </p>
        </section>
      </PageReveal>

      <section className="space-y-5">
        <PageReveal delay={0.1}>
          <p className="font-body text-[11px] uppercase tracking-[0.28em] text-muted">
            Pieces in This Theory
          </p>
        </PageReveal>
        <PageReveal delay={0.12}>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {theoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </PageReveal>
      </section>

      <PageReveal delay={0.16}>
        <section className="-mx-4 border-y border-surface bg-[#11161f] px-4 py-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <p className="font-display text-4xl italic leading-[0.95] text-text sm:text-5xl">
              The theory doesn&apos;t end here.
            </p>
            <Link
              href="/theories"
              className="font-body text-xs uppercase tracking-[0.24em] text-gold transition hover:text-taupe"
            >
              Explore all Theories
            </Link>
          </div>
        </section>
      </PageReveal>
    </div>
  );
}
