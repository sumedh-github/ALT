import Link from "next/link";

import { AltButton } from "@/components/alt/alt-button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl space-y-5 rounded-sm border border-surface bg-surface/20 p-8 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-taupe">404</p>
      <h1 className="font-display text-5xl">Lost in the Dark</h1>
      <p className="text-sm text-taupe">
        This path does not exist in the ALT structure. Return to the collection.
      </p>
      <Link href="/">
        <AltButton>Back to Home</AltButton>
      </Link>
    </section>
  );
}
