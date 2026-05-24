import { CheckoutForm } from "@/components/alt/checkout-form";
import { CheckoutSummary } from "@/components/alt/checkout-summary";
import { SectionIntro } from "@/components/alt/section-intro";

export const metadata = {
  title: "Checkout | Avero Loose Theory"
};

export default function CheckoutPage() {
  return (
    <div className="space-y-8 pb-8">
      <SectionIntro
        eyebrow="Secure Checkout"
        title="Finalize Your ALT Selection"
        body="Confirm your details, then continue to Stripe for secure payment. ALT orders are packed in protective matte black archival packaging."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-sm border border-surface bg-surface/25 p-6">
          <CheckoutForm />
        </div>
        <CheckoutSummary />
      </div>
    </div>
  );
}
