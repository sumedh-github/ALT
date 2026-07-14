"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.18 }
  }
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export function HomeHero() {
  return (
    <section className="noise-overlay relative min-h-[calc(100vh-6rem)] overflow-hidden rounded-md border border-surface/80 bg-bg px-6 py-14 sm:px-10 sm:py-20">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=80"
          alt="ALT hero background editorial frame"
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/78 to-bg/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(201,169,110,0.13),transparent_40%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative flex min-h-[70vh] flex-col justify-center"
      >
        <motion.p
          variants={item}
          className="font-body text-xs uppercase tracking-[0.32em] text-taupe"
        >
          Avero Loose Theory
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-4 font-display text-[clamp(3.2rem,10vw,8.6rem)] leading-[0.86] text-text"
        >
          THE OVERSIZED
        </motion.h1>
        <motion.h1
          variants={item}
          className="ml-[80px] font-display text-[clamp(3.2rem,10vw,8.6rem)] leading-[0.86] text-text"
        >
          THEORY
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-8 max-w-xl font-body text-xs uppercase tracking-[0.24em] text-taupe"
        >
          Dark luxury streetwear for quiet silhouettes and controlled volume.
        </motion.p>
        <motion.div variants={item} className="mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-sm border border-gold bg-gold px-6 py-3 font-body text-xs uppercase tracking-[0.24em] text-bg transition hover:bg-gold/90"
          >
            Enter the Drop
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
