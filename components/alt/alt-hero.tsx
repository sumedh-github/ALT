"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AltButton } from "@/components/alt/alt-button";

export function AltHero() {
  return (
    <section className="noise-overlay relative overflow-hidden rounded-md border border-taupe/20 bg-alt-grain px-6 py-14 sm:px-10 sm:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-3xl"
      >
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-taupe">
          Avero Loose Theory
        </p>
        <h1 className="font-display text-5xl leading-[0.9] text-text sm:text-7xl">
          The Oversized Theory
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-taupe sm:text-base">
          ALT frames dark luxury streetwear through structure, weight, and
          restraint. Every silhouette is engineered to feel heavy, quiet, and
          unmistakably present.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop">
            <AltButton>Shop Collection</AltButton>
          </Link>
          <Link href="/lookbook">
            <AltButton variant="ghost">View Lookbook</AltButton>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
