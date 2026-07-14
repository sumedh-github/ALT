"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageRevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function PageReveal({ children, delay = 0, className }: PageRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
