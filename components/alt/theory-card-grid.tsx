"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import type { Theory } from "@/lib/mock-data";

interface TheoryCardGridProps {
  theories: Theory[];
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06
    }
  }
};

const card = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } }
};

export function TheoryCardGrid({ theories }: TheoryCardGridProps) {
  return (
    <AnimatePresence>
      <motion.section
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid gap-8 md:grid-cols-2"
      >
        {theories.map((theory) => (
          <motion.article key={theory.id} variants={card} className="group space-y-4">
            <Link href={`/theories/${theory.slug}`} className="block">
              <div className="relative aspect-[3/2] overflow-hidden rounded-sm border border-surface bg-[#2a2a2a]">
                <Image
                  src={theory.image}
                  alt={`${theory.name} collection preview`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/35" />
                <div className="pointer-events-none absolute inset-[10px] border border-gold/0 transition duration-300 group-hover:border-gold/70" />
              </div>
            </Link>

            <div className="space-y-2">
              <p className="font-body text-[11px] uppercase tracking-[0.25em] text-muted">
                {theory.number}
              </p>
              <h2 className="font-display text-[32px] leading-[0.9] text-text">
                {theory.name}
              </h2>
              <p className="max-w-xl font-body text-sm leading-relaxed text-taupe">
                {theory.description}
              </p>
              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-muted">
                  {theory.productIds.length} pieces
                </p>
                <Link
                  href={`/theories/${theory.slug}`}
                  className="font-body text-xs uppercase tracking-[0.2em] text-gold transition hover:text-taupe"
                >
                  Explore Theory →
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.section>
    </AnimatePresence>
  );
}
