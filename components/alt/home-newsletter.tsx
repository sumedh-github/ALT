"use client";

import { FormEvent, useState } from "react";

export function HomeNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = (await response.json()) as {
        error?: string;
        subscribed?: boolean;
      };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Unable to subscribe right now.");
        return;
      }

      if (data.subscribed === false) {
        setStatus("error");
        setMessage("This email is already in the theory.");
        return;
      }

      setStatus("success");
      setMessage("You're in the theory");
      setEmail("");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Unable to subscribe right now.");
    }
  }

  return (
    <section className="py-10">
      <div className="max-w-3xl pl-6 sm:pl-14 lg:pl-24">
        <p className="font-display text-3xl italic tracking-[0.08em] text-gold sm:text-4xl">
          JOIN THE THEORY
        </p>
        <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-muted">
          Receive early access to limited drops, lookbook releases, and private
          dispatches from Avero Loose Theory.
        </p>
        <form onSubmit={onSubmit} className="mt-7 flex max-w-xl items-end gap-6">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            required
            className="w-full border-b border-taupe/35 bg-transparent pb-2 font-body text-sm text-text placeholder:text-muted focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="font-body text-xs uppercase tracking-[0.24em] text-gold transition hover:text-taupe"
          >
            {status === "loading" ? "Sending" : "Submit"}
          </button>
        </form>
        {status !== "idle" ? (
          <p
            className={`mt-3 font-body text-xs uppercase tracking-[0.16em] ${
              status === "success" ? "text-gold" : "text-red-300"
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
