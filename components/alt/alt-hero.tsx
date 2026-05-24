"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AltButton } from "@/components/alt/alt-button";
import { AltLogoEmblem } from "@/components/alt/alt-logo-emblem";

export function AltHero() {
  return (
    <section className="noise-overlay relative overflow-hidden rounded-md border border-taupe/20 bg-alt-grain px-6 py-14 sm:px-10 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(201,169,110,0.12),transparent_48%)]" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_360px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
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

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: "easeOut" }}
          className="mx-auto w-full max-w-[320px] lg:max-w-[360px]"
        >
          <AltLogoEmblem />
        </motion.div>
      </div>
    </section>
  );
}
