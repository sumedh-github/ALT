"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AltButton } from "@/components/alt/alt-button";
import { AltLogoEmblem } from "@/components/alt/alt-logo-emblem";

export function AltHero() {
  return (
    <section className="noise-overlay relative min-h-[calc(100vh-7rem)] overflow-hidden rounded-md border border-taupe/20 bg-alt-grain px-6 py-14 sm:px-10 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(201,169,110,0.11),transparent_45%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="relative max-w-3xl"
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

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.14, ease: "easeOut" }}
        className="pointer-events-none absolute right-[4%] top-[18%] hidden w-[320px] lg:block"
      >
        <AltLogoEmblem />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
        className="mt-12 ml-6 w-[170px] sm:mt-14 sm:w-[220px] lg:hidden"
      >
        <AltLogoEmblem />
      </motion.div>
    </section>
  );
}
