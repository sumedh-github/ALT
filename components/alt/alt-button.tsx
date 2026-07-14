import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm border text-sm uppercase tracking-[0.22em] transition duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        gold: "border-gold bg-gold px-6 py-3 text-bg hover:bg-gold/90",
        ghost:
          "border-taupe/30 bg-transparent px-5 py-3 text-text hover:border-gold hover:text-gold",
        surface:
          "border-surface bg-surface px-5 py-3 text-text hover:border-taupe/60 hover:bg-surface/70"
      }
    },
    defaultVariants: {
      variant: "gold"
    }
  }
);

type AltButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const AltButton = forwardRef<HTMLButtonElement, AltButtonProps>(
  ({ className, variant, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  )
);

AltButton.displayName = "AltButton";
