"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "Full name is required."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password.")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

type RegisterValues = z.infer<typeof registerSchema>;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

export default function RegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" }
  });

  const onSubmit = async (values: RegisterValues) => {
    setSubmitting(true);
    setAuthError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      setSubmitting(false);

      if (response.status === 409) {
        setAuthError("An account with this email already exists.");
        return;
      }

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setAuthError(payload?.error ?? "Unable to register right now.");
      return;
    }

    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/account"
    });

    setSubmitting(false);

    if (signInResult?.error) {
      setAuthError("Account created, but auto-login failed. Please login manually.");
      router.push("/login");
      return;
    }

    router.push("/account");
    router.refresh();
  };

  return (
    <div className="noise-overlay -mx-4 min-h-[calc(100vh-10rem)] overflow-hidden sm:-mx-6 lg:-mx-8">
      <div className="grid min-h-[calc(100vh-10rem)] lg:grid-cols-2">
        <section className="bg-[#1a1e24] p-10 sm:p-14">
          <div className="max-w-xl">
            <p className="font-display text-[clamp(3rem,8vw,6.8rem)] leading-[0.84] text-text">
              AVERO
              <br />
              LOOSE
              <br />
              THEORY
            </p>
            <p className="mt-6 font-body text-xs uppercase tracking-[0.22em] text-muted">
              The Oversized Theory
            </p>
          </div>
        </section>

        <section className="flex items-center bg-[#2a2a2a] p-8 sm:p-14">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md space-y-5"
          >
            <motion.h1 variants={staggerItem} className="font-display text-5xl leading-none text-text">
              Register
            </motion.h1>

            <motion.form variants={staggerItem} className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Field label="Full Name" error={errors.name?.message}>
                <input
                  type="text"
                  className="w-full border border-surface bg-black/20 px-4 py-3 font-body text-sm text-text outline-none transition focus:border-gold"
                  {...register("name")}
                />
              </Field>

              <Field label="Email" error={errors.email?.message}>
                <input
                  type="email"
                  className="w-full border border-surface bg-black/20 px-4 py-3 font-body text-sm text-text outline-none transition focus:border-gold"
                  {...register("email")}
                />
              </Field>

              <Field label="Password" error={errors.password?.message}>
                <input
                  type="password"
                  className="w-full border border-surface bg-black/20 px-4 py-3 font-body text-sm text-text outline-none transition focus:border-gold"
                  {...register("password")}
                />
              </Field>

              <Field label="Confirm Password" error={errors.confirmPassword?.message}>
                <input
                  type="password"
                  className="w-full border border-surface bg-black/20 px-4 py-3 font-body text-sm text-text outline-none transition focus:border-gold"
                  {...register("confirmPassword")}
                />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#c9a96e] px-4 py-3 font-body text-xs uppercase tracking-[0.25em] text-[#1a1e24] transition hover:bg-[#d7b981] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Joining..." : "Join the Theory"}
              </button>
            </motion.form>

            {authError ? <p className="text-sm text-red-300/90">{authError}</p> : null}

            <motion.p variants={staggerItem} className="font-body text-sm text-muted">
              Already inside?{" "}
              <Link href="/login" className="text-gold transition hover:text-taupe">
                Enter the Theory
              </Link>
            </motion.p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="font-body text-xs uppercase tracking-[0.22em] text-taupe">{label}</label>
      {children}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
