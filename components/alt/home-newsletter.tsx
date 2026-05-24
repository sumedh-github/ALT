"use client";

export function HomeNewsletter() {
  return (
    <section className="rounded-sm border border-surface bg-[#12161f] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-body text-xs uppercase tracking-[0.32em] text-gold">
          Join the Theory
        </p>
        <p className="mt-4 font-body text-sm leading-relaxed text-taupe">
          Receive early access to limited drops, lookbook releases, and private
          ALT dispatches.
        </p>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-sm border border-surface bg-bg px-4 py-3 font-body text-sm text-text placeholder:text-muted focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-sm border border-gold bg-gold px-5 py-3 font-body text-xs uppercase tracking-[0.24em] text-bg transition hover:bg-gold/90"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
