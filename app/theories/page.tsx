import { TheoryCardGrid } from "@/components/alt/theory-card-grid";
import { PageReveal } from "@/components/alt/page-reveal";
import { altTheories } from "@/lib/mock-data";

export const metadata = {
  title: "Theories | Avero Loose Theory"
};

export default function TheoriesPage() {
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

      <TheoryCardGrid theories={altTheories} />
    </div>
  );
}
