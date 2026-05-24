"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AltButton } from "@/components/alt/alt-button";
import { AltInput } from "@/components/alt/alt-input";
import { forgotPasswordSchema } from "@/lib/validations/auth";

type ForgotValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = async (values: ForgotValues) => {
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    setDone(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AltInput placeholder="Email" type="email" {...register("email")} />
      {errors.email ? (
        <p className="text-xs text-red-300">{errors.email.message}</p>
      ) : null}
      {done ? (
        <p className="text-xs uppercase tracking-[0.15em] text-gold">
          If this address exists, a reset link was sent.
        </p>
      ) : null}
      <AltButton className="w-full" disabled={isSubmitting}>
        Send reset link
      </AltButton>
    </form>
  );
}
