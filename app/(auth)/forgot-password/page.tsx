"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address.")
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    setLoading(false);

    if (!response.ok) {
      setError("Unable to process your request right now.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <section className="noise-overlay -mx-4 flex min-h-[calc(100vh-10rem)] items-center justify-center bg-[#1a1e24] px-4 sm:-mx-6 lg:-mx-8">
      <div className="w-full max-w-lg border border-surface bg-[#2a2a2a]/70 p-8">
        {!submitted ? (
          <>
            <h1 className="font-display text-5xl leading-none text-text">Reset Your Access</h1>
            <p className="mt-4 font-body text-sm leading-relaxed text-muted">
              Enter your email and we&apos;ll send a reset link.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="font-body text-xs uppercase tracking-[0.22em] text-taupe">Email</label>
                <input
                  type="email"
                  className="w-full border border-surface bg-black/20 px-4 py-3 font-body text-sm text-text outline-none transition focus:border-gold"
                  {...register("email")}
                />
                {errors.email ? <p className="text-sm text-red-300">{errors.email.message}</p> : null}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c9a96e] px-4 py-3 font-body text-xs uppercase tracking-[0.25em] text-[#1a1e24] transition hover:bg-[#d7b981] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Link"}
              </button>
            </form>
            {error ? <p className="mt-4 text-sm text-red-300/90">{error}</p> : null}
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="font-display text-5xl leading-none text-text">Check your inbox</h2>
            <p className="font-body text-sm text-muted">
              If the email exists, a reset link is on the way.
            </p>
            <Link
              href="/login"
              className="inline-block font-body text-xs uppercase tracking-[0.24em] text-gold transition hover:text-taupe"
            >
              Back to login
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
