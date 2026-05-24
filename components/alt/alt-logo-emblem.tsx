import { cn } from "@/lib/utils";

interface AltLogoEmblemProps {
  className?: string;
}

export function AltLogoEmblem({ className }: AltLogoEmblemProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm border border-gold/40 bg-bg/70 px-4 py-3 shadow-luxe backdrop-blur-sm",
        className
      )}
    >
      <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-gold/10 blur-xl" />
      <p className="text-[10px] uppercase tracking-[0.35em] text-taupe">Avero Loose Theory</p>
      <p className="mt-1 font-display text-4xl leading-none tracking-[0.14em] text-text">
        ALT
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted">
        The Oversized Theory
      </p>
    </div>
  );
}
