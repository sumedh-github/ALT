"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AltButton } from "@/components/alt/alt-button";
import { AltInput } from "@/components/alt/alt-input";
import { registerSchema } from "@/lib/validations/auth";

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" }
  });

  const onSubmit = async (values: RegisterValues) => {
    setServerError(null);

    if (values.password !== values.confirmPassword) {
      setServerError("Passwords must match.");
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setServerError(payload.error ?? "Account creation failed.");
      return;
    }

    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <AltInput placeholder="Full name" {...register("name")} />
        {errors.name ? (
          <p className="mt-1 text-xs text-red-300">{errors.name.message}</p>
        ) : null}
      </div>
      <div>
        <AltInput placeholder="Email" type="email" {...register("email")} />
        {errors.email ? (
          <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>
        ) : null}
      </div>
      <div>
        <AltInput type="password" placeholder="Password" {...register("password")} />
        {errors.password ? (
          <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>
        ) : null}
      </div>
      <div>
        <AltInput
          type="password"
          placeholder="Confirm password"
          {...register("confirmPassword")}
        />
      </div>
      {serverError ? <p className="text-xs text-red-300">{serverError}</p> : null}
      <AltButton className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Building profile..." : "Create ALT account"}
      </AltButton>
      <p className="text-center text-xs uppercase tracking-[0.15em] text-muted">
        Already inside?{" "}
        <Link href="/login" className="text-gold hover:text-taupe">
          Return to login
        </Link>
      </p>
    </form>
  );
}
