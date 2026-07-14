import { HomeBrandStatement } from "@/components/alt/home-brand-statement";
import { HomeDropSection } from "@/components/alt/home-drop-section";
import { HomeHero } from "@/components/alt/home-hero";
import { HomeLookbookTeaser } from "@/components/alt/home-lookbook-teaser";
import { HomeNewsletter } from "@/components/alt/home-newsletter";
import { PageReveal } from "@/components/alt/page-reveal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [featuredTheory, featuredProducts] = await Promise.all([
    prisma.theory.findFirst({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        number: true,
        name: true,
        description: true,
        image: true
      }
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE", featured: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, slug: true, name: true }
    })
  ]);

  return (
    <div className="space-y-14 pb-10">
      <HomeHero />
      <PageReveal delay={0.1}>
        <HomeDropSection
          featuredTheory={featuredTheory}
          featuredProducts={featuredProducts}
        />
      </PageReveal>
      <PageReveal delay={0.12}>
        <HomeBrandStatement />
      </PageReveal>
      <PageReveal delay={0.15}>
        <HomeLookbookTeaser />
      </PageReveal>
      <PageReveal delay={0.18}>
        <HomeNewsletter />
      </PageReveal>
    </div>
  );
}
