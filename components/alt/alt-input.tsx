import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AltInputProps = InputHTMLAttributes<HTMLInputElement>;

export const AltInput = forwardRef<HTMLInputElement, AltInputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-sm border border-taupe/30 bg-transparent px-4 py-3 text-sm text-text placeholder:text-muted transition focus-visible:border-gold focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
);

AltInput.displayName = "AltInput";
