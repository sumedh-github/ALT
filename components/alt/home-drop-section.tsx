import Image from "next/image";
import Link from "next/link";

interface FeaturedTheorySummary {
  id: string;
  slug: string;
  number: string;
  name: string;
  description: string;
  image: string;
}

interface FeaturedDropProduct {
  id: string;
  slug: string;
  name: string;
}

interface HomeDropSectionProps {
  featuredTheory: FeaturedTheorySummary | null;
  featuredProducts: FeaturedDropProduct[];
}

export function HomeDropSection({
  featuredTheory,
  featuredProducts
}: HomeDropSectionProps) {
  const theory = featuredTheory ?? {
    id: "fallback-theory",
    slug: "theories",
    number: "DROP",
    name: "Nocturne Layer System",
    description:
      "Heavy fleece, broad shoulders, and elongated lines built for calm dominance in motion.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80"
  };

  return (
    <section className="-mx-4 sm:-mx-6 lg:-mx-8">
      <div className="relative overflow-hidden border-y border-surface bg-[#151922] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5 lg:pl-4">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-taupe">
              {theory.number}
            </p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.8rem)] leading-[0.9] text-text">
              {theory.name}
            </h2>
            <p className="max-w-md font-body text-sm leading-relaxed text-taupe">
              {theory.description}
            </p>
            {featuredProducts.length ? (
              <div className="space-y-1">
                <p className="font-body text-[11px] uppercase tracking-[0.22em] text-muted">
                  Featured Pieces
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {featuredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      className="font-body text-xs uppercase tracking-[0.18em] text-taupe transition hover:text-gold"
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            <Link
              href={featuredTheory ? `/theories/${theory.slug}` : "/shop"}
              className="inline-block font-body text-xs uppercase tracking-[0.24em] text-gold transition hover:text-taupe"
            >
              Shop the Collection
            </Link>
          </div>

          <div className="relative lg:-mr-6">
            <div className="relative h-[420px] overflow-hidden rounded-sm border border-surface md:h-[520px]">
              <Image
                src={theory.image}
                alt="ALT drop editorial frame"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
