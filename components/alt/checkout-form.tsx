"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AltButton } from "@/components/alt/alt-button";
import { AltInput } from "@/components/alt/alt-input";
import { checkoutSchema } from "@/lib/validations/checkout";
import { useCartStore } from "@/store/cart-store";

const formSchema = checkoutSchema.omit({ items: true });
type CheckoutFormValues = z.infer<typeof formSchema>;

export function CheckoutForm() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      shippingName: "",
      shippingAddress: "",
      shippingCity: "",
      shippingPostalCode: "",
      shippingCountry: ""
    }
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    setServerError(null);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, items })
    });
    const payload = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !payload.url) {
      setServerError(payload.error ?? "Checkout failed.");
      return;
    }
    clearCart();
    window.location.assign(payload.url);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AltInput placeholder="Email" type="email" {...register("email")} />
      <AltInput placeholder="Full name" {...register("shippingName")} />
      <AltInput placeholder="Address" {...register("shippingAddress")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <AltInput placeholder="City" {...register("shippingCity")} />
        <AltInput placeholder="Postal code" {...register("shippingPostalCode")} />
      </div>
      <AltInput placeholder="Country" {...register("shippingCountry")} />

      {Object.values(errors)[0]?.message ? (
        <p className="text-xs text-red-300">{Object.values(errors)[0]?.message}</p>
      ) : null}
      {serverError ? <p className="text-xs text-red-300">{serverError}</p> : null}

      <AltButton className="w-full" disabled={isSubmitting || !items.length}>
        {isSubmitting ? "Directing to Stripe..." : "Secure checkout"}
      </AltButton>
    </form>
  );
}
