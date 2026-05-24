import { HomeBrandStatement } from "@/components/alt/home-brand-statement";
import { HomeDropSection } from "@/components/alt/home-drop-section";
import { HomeHero } from "@/components/alt/home-hero";
import { HomeLookbookTeaser } from "@/components/alt/home-lookbook-teaser";
import { HomeNewsletter } from "@/components/alt/home-newsletter";
import { PageReveal } from "@/components/alt/page-reveal";

export default function HomePage() {
  return (
    <div className="space-y-14 pb-10">
      <HomeHero />
      <PageReveal delay={0.1}>
        <HomeDropSection />
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
