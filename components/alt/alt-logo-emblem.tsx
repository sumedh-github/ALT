import Image from "next/image";

import { cn } from "@/lib/utils";

interface AltLogoEmblemProps {
  className?: string;
}

export function AltLogoEmblem({ className }: AltLogoEmblemProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-[#0d1118] to-[#0a0d12] p-3 shadow-luxe",
        className
      )}
    >
      <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-gold/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.5rem] border border-surface/70">
        <Image
          src="/alt-logo-mark.svg"
          alt="Avero Loose Theory ALT mark"
          width={900}
          height={900}
          className="h-auto w-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
