import Image from "next/image";

import { cn } from "@/lib/utils";

interface AltLogoEmblemProps {
  className?: string;
}

export function AltLogoEmblem({ className }: AltLogoEmblemProps) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src="/alt-logo-mark.svg"
        alt="Avero Loose Theory ALT mark"
        width={900}
        height={900}
        priority
        className="h-auto w-full object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
      />
    </div>
  );
}
