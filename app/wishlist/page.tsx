import { PageReveal } from "@/components/alt/page-reveal";
import { WishlistPageContent } from "@/components/alt/wishlist-page-content";

export const metadata = {
  title: "Wishlist | Avero Loose Theory"
};

export default function WishlistPage() {
  return (
    <div className="space-y-8 pb-8">
      <PageReveal>
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-taupe">Saved Pieces</p>
          <h1 className="mt-2 font-display text-5xl leading-none text-text sm:text-6xl">
            Wishlist
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-taupe sm:text-base">
            Pieces you are considering before they disappear.
          </p>
        </div>
      </PageReveal>

      <PageReveal delay={0.1}>
        <WishlistPageContent />
      </PageReveal>
    </div>
  );
}
