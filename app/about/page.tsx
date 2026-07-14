import { PageReveal } from "@/components/alt/page-reveal";
import { SectionIntro } from "@/components/alt/section-intro";

const principles = [
  {
    title: "Oversized Precision",
    body: "Our silhouettes are intentionally loose but technically controlled, balancing volume with clean movement."
  },
  {
    title: "Muted Luxury",
    body: "ALT chooses texture and proportion over logos. Gold appears as punctuation, never as noise."
  },
  {
    title: "Unisex by Structure",
    body: "Every piece is designed to adapt across body types through engineered drape and flexible layering."
  }
];

export const metadata = {
  title: "About | Avero Loose Theory"
};

export default function AboutPage() {
  return (
    <div className="space-y-10 pb-8">
      <SectionIntro
        eyebrow="About ALT"
        title="Dark Luxury Streetwear, Refined"
        body="Avero Loose Theory is built on silent confidence. We design oversized essentials that speak through weight, line, and restraint."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {principles.map((principle, index) => (
          <PageReveal
            key={principle.title}
            delay={index * 0.08}
            className="rounded-sm border border-surface bg-surface/30 p-5"
          >
            <h2 className="font-display text-3xl leading-none">{principle.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-taupe">{principle.body}</p>
          </PageReveal>
        ))}
      </section>
    </div>
  );
}
