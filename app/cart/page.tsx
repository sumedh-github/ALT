import { CartView } from "@/components/alt/cart-view";
import { SectionIntro } from "@/components/alt/section-intro";

export const metadata = {
  title: "Cart | Avero Loose Theory"
};

export default function CartPage() {
  return (
    <div className="space-y-8 pb-8">
      <SectionIntro
        eyebrow="Cart"
        title="Selected Silhouettes"
        body="Review your selected pieces and adjust quantities before returning to shop."
      />
      <CartView />
    </div>
  );
}
