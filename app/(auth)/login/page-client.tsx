"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.")
});

type LoginValues = z.infer<typeof loginSchema>;

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

interface LoginClientPageProps {
  callbackUrl: string;
}

export function LoginClientPage({ callbackUrl }: LoginClientPageProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [oauthSubmitting, setOauthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (values: LoginValues) => {
    setSubmitting(true);
    setAuthError(null);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl
    });

    setSubmitting(false);

    if (result?.error) {
      setAuthError("Credentials don’t match our records.");
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  };

  const onGoogle = async () => {
    setOauthSubmitting(true);
    await signIn("google", { callbackUrl });
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
              Login
            </motion.h1>

            <motion.form variants={staggerItem} className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="email" className="font-body text-xs uppercase tracking-[0.22em] text-taupe">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full border border-surface bg-black/20 px-4 py-3 font-body text-sm text-text outline-none transition focus:border-gold"
                  {...register("email")}
                />
                {errors.email ? <p className="text-sm text-red-300">{errors.email.message}</p> : null}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="font-body text-xs uppercase tracking-[0.22em] text-taupe"
                >
                  Password
                </label>
                <div className="flex border border-surface bg-black/20 focus-within:border-gold">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-transparent px-4 py-3 font-body text-sm text-text outline-none"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="px-4 font-body text-[11px] uppercase tracking-[0.2em] text-taupe transition hover:text-gold"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-sm text-red-300">{errors.password.message}</p>
                ) : null}
              </div>

              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="font-body text-xs uppercase tracking-[0.2em] text-taupe transition hover:text-gold"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#c9a96e] px-4 py-3 font-body text-xs uppercase tracking-[0.25em] text-[#1a1e24] transition hover:bg-[#d7b981] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Entering..." : "Enter the Theory"}
              </button>
            </motion.form>

            <motion.div variants={staggerItem} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-surface" />
                <p className="font-body text-xs uppercase tracking-[0.2em] text-muted">or continue with</p>
                <div className="h-px flex-1 bg-surface" />
              </div>

              <button
                type="button"
                onClick={onGoogle}
                disabled={oauthSubmitting}
                className="w-full border border-surface bg-transparent px-4 py-3 font-body text-xs uppercase tracking-[0.24em] text-text transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue with Google
              </button>

              {authError ? <p className="text-sm text-red-300/90">{authError}</p> : null}
            </motion.div>

            <motion.p variants={staggerItem} className="font-body text-sm text-muted">
              New here?{" "}
              <Link href="/register" className="text-gold transition hover:text-taupe">
                Join the Theory
              </Link>
            </motion.p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
