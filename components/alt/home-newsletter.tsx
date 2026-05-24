"use client";

export function HomeNewsletter() {
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
        <form className="mt-7 flex max-w-xl items-end gap-6">
          <input
            type="email"
            placeholder="Email address"
            className="w-full border-b border-taupe/35 bg-transparent pb-2 font-body text-sm text-text placeholder:text-muted focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="font-body text-xs uppercase tracking-[0.24em] text-gold transition hover:text-taupe"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
