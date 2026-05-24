"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { AltButton } from "@/components/alt/alt-button";
import { AltInput } from "@/components/alt/alt-input";
import { loginSchema } from "@/lib/validations/auth";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (values: LoginValues) => {
    setAuthError(null);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false
    });

    if (result?.error) {
      setAuthError("Credentials are incorrect. Re-enter your details.");
      return;
    }

    router.push("/account");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <AltInput placeholder="Email" type="email" {...register("email")} />
        {errors.email ? (
          <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>
        ) : null}
      </div>
      <div>
        <AltInput
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>
        ) : null}
      </div>
      {authError ? <p className="text-xs text-red-300">{authError}</p> : null}
      <AltButton className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Entering..." : "Enter ALT"}
      </AltButton>
      <button
        type="button"
        className="w-full rounded-sm border border-surface px-4 py-3 text-xs uppercase tracking-[0.2em] text-taupe transition hover:border-gold hover:text-gold"
        onClick={() => signIn("google", { callbackUrl: "/account" })}
      >
        Continue with Google
      </button>
      <div className="flex justify-between text-xs uppercase tracking-[0.15em] text-muted">
        <Link className="hover:text-gold" href="/forgot-password">
          Forgot password
        </Link>
        <Link className="hover:text-gold" href="/register">
          Create account
        </Link>
      </div>
    </form>
  );
}
