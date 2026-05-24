import Image from "next/image";
import Link from "next/link";

import { PageReveal } from "@/components/alt/page-reveal";

const primaryFrames = [
  {
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80",
    alt: "ALT lookbook cinematic frame",
    label: "Nocturne Entry"
  },
  {
    src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80",
    alt: "ALT layered silhouette frame",
    label: "Layer Discipline"
  },
  {
    src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1400&q=80",
    alt: "ALT outerwear portrait frame",
    label: "Shadow Profile"
  }
];

const editorialFrames = [
  "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1618354691321-e851c56960d1?auto=format&fit=crop&w=1400&q=80"
];

export const metadata = {
  title: "Lookbook | Avero Loose Theory"
};

export default function LookbookPage() {
  return (
    <div className="space-y-12 pb-10">
      <PageReveal className="space-y-5 pl-2 sm:pl-8 lg:pl-16">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-taupe">
          Investor Lookbook Deck
        </p>
        <h1 className="font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.88] text-text">
          Volume Studies
        </h1>
        <p className="max-w-2xl font-body text-sm leading-relaxed text-taupe">
          A visual narrative of ALT proportion language: weighted hoodies, extended
          tees, and oversized shirting presented as a cinematic retail identity.
        </p>
      </PageReveal>

      <PageReveal delay={0.08}>
        <section className="-mx-4 overflow-hidden border-y border-surface bg-[#141a23] sm:-mx-6 lg:-mx-8">
          <div className="grid items-end gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:px-8 lg:py-10">
            <div className="relative h-[420px] overflow-hidden rounded-sm border border-surface md:h-[560px]">
              <Image
                src={primaryFrames[0].src}
                alt={primaryFrames[0].alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
            <div className="space-y-5 pr-2 lg:translate-y-5">
              <p className="font-body text-xs uppercase tracking-[0.24em] text-gold">
                Drop Narrative
              </p>
              <h2 className="font-display text-5xl leading-[0.9] text-text">
                Oversized, Not Overstated
              </h2>
              <p className="font-body text-sm leading-relaxed text-taupe">
                Each frame is built to sell silhouette confidence before product
                details. This lookbook format is optimized for investor demos,
                launch previews, and retail partner presentations.
              </p>
              <Link
                href="/shop"
                className="inline-block font-body text-xs uppercase tracking-[0.24em] text-gold transition hover:text-taupe"
              >
                Enter the Shop Deck
              </Link>
            </div>
          </div>
        </section>
      </PageReveal>

      <section className="space-y-5">
        <PageReveal delay={0.12} className="pl-1 sm:pl-8">
          <p className="font-body text-xs uppercase tracking-[0.24em] text-muted">
            Campaign Frames
          </p>
        </PageReveal>
        <div className="grid gap-4 md:grid-cols-[1fr_0.9fr]">
          <PageReveal delay={0.15} className="relative h-[420px] md:h-[560px]">
            <div className="relative h-full overflow-hidden rounded-sm border border-surface">
              <Image
                src={primaryFrames[1].src}
                alt={primaryFrames[1].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-2 backdrop-blur-sm">
                <p className="font-body text-[11px] uppercase tracking-[0.22em] text-text">
                  {primaryFrames[1].label}
                </p>
              </div>
            </div>
          </PageReveal>
          <PageReveal delay={0.2} className="space-y-4 md:translate-y-12">
            <div className="relative h-[250px] overflow-hidden rounded-sm border border-surface md:h-[300px]">
              <Image
                src={primaryFrames[2].src}
                alt={primaryFrames[2].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
              <div className="absolute bottom-3 left-3 bg-black/50 px-3 py-2 backdrop-blur-sm">
                <p className="font-body text-[11px] uppercase tracking-[0.22em] text-text">
                  {primaryFrames[2].label}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {editorialFrames.map((frame, index) => (
                <div
                  key={frame}
                  className={`relative h-[210px] overflow-hidden rounded-sm border border-surface ${
                    index === 1 ? "translate-y-5" : ""
                  }`}
                >
                  <Image
                    src={frame}
                    alt="ALT editorial close-up frame"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 22vw"
                  />
                </div>
              ))}
            </div>
          </PageReveal>
        </div>
      </section>

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
