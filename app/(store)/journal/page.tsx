import { PageReveal } from "@/components/alt/page-reveal";
import { SectionIntro } from "@/components/alt/section-intro";

const entries = [
  {
    title: "Weight as Language",
    excerpt:
      "ALT silhouettes begin with textile density. Structure is not decoration - it is the first line of expression."
  },
  {
    title: "Muted Gold Direction",
    excerpt:
      "Our gold accent is not shine. It is warmth through restraint, used where attention belongs: closure lines, trims, and price language."
  },
  {
    title: "The Long Shoulder Cut",
    excerpt:
      "Dropped shoulders and extended sleeves create flow under movement while preserving a strong front profile."
  }
];

export const metadata = {
  title: "Journal | Avero Loose Theory"
};

export default function JournalPage() {
  return (
    <div className="space-y-8 pb-8">
      <SectionIntro
        eyebrow="ALT Journal"
        title="Design Notes in Quiet Tones"
        body="A closer look at silhouette discipline, material decisions, and why oversized can still be precise."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {entries.map((entry, index) => (
          <PageReveal
            key={entry.title}
            delay={index * 0.08}
            className="rounded-sm border border-surface bg-surface/30 p-5"
          >
            <h2 className="font-display text-3xl leading-none">{entry.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-taupe">{entry.excerpt}</p>
          </PageReveal>
        ))}
      </div>
    </div>
  );
}
