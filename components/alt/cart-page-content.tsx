"use client";

import { CartView } from "@/components/alt/cart-view";
import { SectionIntro } from "@/components/alt/section-intro";
import { useCartSummary } from "@/hooks/use-cart-summary";

export function CartPageContent() {
  const { items } = useCartSummary();
  const title = items.length === 1 ? "Selected Theory" : "Selected Theories";

  return (
    <div className="space-y-8 pb-8">
      <SectionIntro
        eyebrow="Cart"
        title={title}
        body="Review your selected pieces and adjust quantities before returning to shop."
      />
      <CartView />
    </div>
  );
}
