import Image from "next/image";

import { PageReveal } from "@/components/alt/page-reveal";
import { SectionIntro } from "@/components/alt/section-intro";

const frames = [
  "https://res.cloudinary.com/demo/image/upload/v1720000000/alt-lookbook-1.jpg",
  "https://res.cloudinary.com/demo/image/upload/v1720000000/alt-lookbook-2.jpg",
  "https://res.cloudinary.com/demo/image/upload/v1720000000/alt-lookbook-3.jpg"
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
        body="An ongoing visual study of oversized structure, layered proportion, and tonal tension inside the ALT language."
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
