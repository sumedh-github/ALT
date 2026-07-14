"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password.")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

type ResetValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordClient />
    </Suspense>
  );
}

function ResetPasswordLoading() {
  return (
    <section className="noise-overlay -mx-4 flex min-h-[calc(100vh-10rem)] items-center justify-center bg-[#1a1e24] px-4 sm:-mx-6 lg:-mx-8">
      <div className="w-full max-w-lg border border-surface bg-[#2a2a2a]/70 p-8">
        <p className="font-body text-sm text-muted">Loading reset page...</p>
      </div>
    </section>
  );
}

function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValid(false);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/auth/validate-reset-token?token=${token}`);
      const payload = (await response.json().catch(() => null)) as { valid?: boolean } | null;
      setValid(Boolean(payload?.valid));
      setLoading(false);
    };

    void validateToken();
  }, [token]);

  const onSubmit = async (values: ResetValues) => {
    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/auth/reset-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...values })
    });

    setSubmitting(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setError(payload?.error ?? "Unable to reset password.");
      return;
    }

    router.push("/login?reset=success");
  };

  return (
    <section className="noise-overlay -mx-4 flex min-h-[calc(100vh-10rem)] items-center justify-center bg-[#1a1e24] px-4 sm:-mx-6 lg:-mx-8">
      <div className="w-full max-w-lg border border-surface bg-[#2a2a2a]/70 p-8">
        {loading ? (
          <p className="font-body text-sm text-muted">Validating your reset link...</p>
        ) : !valid ? (
          <div className="space-y-4">
            <h1 className="font-display text-5xl leading-none text-text">Link expired</h1>
            <p className="font-body text-sm text-muted">
              Your reset link is invalid or expired.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block font-body text-xs uppercase tracking-[0.24em] text-gold transition hover:text-taupe"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-5xl leading-none text-text">Set New Password</h1>
            <p className="mt-4 font-body text-sm text-muted">
              Choose a new password to continue your theory.
            </p>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="font-body text-xs uppercase tracking-[0.22em] text-taupe">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full border border-surface bg-black/20 px-4 py-3 font-body text-sm text-text outline-none transition focus:border-gold"
                  {...register("password")}
                />
                {errors.password ? <p className="text-sm text-red-300">{errors.password.message}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="font-body text-xs uppercase tracking-[0.22em] text-taupe">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full border border-surface bg-black/20 px-4 py-3 font-body text-sm text-text outline-none transition focus:border-gold"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword ? (
                  <p className="text-sm text-red-300">{errors.confirmPassword.message}</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#c9a96e] px-4 py-3 font-body text-xs uppercase tracking-[0.25em] text-[#1a1e24] transition hover:bg-[#d7b981] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
            {error ? <p className="mt-4 text-sm text-red-300/90">{error}</p> : null}
          </>
        )}
      </div>
    </section>
  );
}
