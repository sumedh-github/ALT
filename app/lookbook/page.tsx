import Image from "next/image";

import { PageReveal } from "@/components/alt/page-reveal";
import { SectionIntro } from "@/components/alt/section-intro";

const frames = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80"
];

export const metadata = {
  title: "Lookbook | Avero Loose Theory"
};

export default function LookbookPage() {
  return (
    <div className="space-y-8 pb-8">
      <SectionIntro
        eyebrow="Lookbook"
        title="Editorial Volume Studies"
        body="A visual record of ALT proportion: shadow-heavy palettes, long shoulders, grounded drape, and muted gold accents."
      />
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        {frames.map((frame, index) => (
          <PageReveal
            key={frame}
            delay={index * 0.12}
            className={index === 0 ? "md:row-span-2" : ""}
          >
            <div className="relative min-h-80 overflow-hidden rounded-sm border border-surface">
              <Image
                src={frame}
                alt="ALT lookbook frame"
                fill
                className="object-cover transition duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </PageReveal>
        ))}
      </div>
    </div>
  );
}
