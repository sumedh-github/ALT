import Image from "next/image";
import Link from "next/link";

export function HomeLookbookTeaser() {
  return (
    <section className="relative overflow-hidden rounded-sm border border-surface bg-[#141923] px-4 py-6 sm:px-6 sm:py-8">
      <p className="mb-4 font-body text-xs uppercase tracking-[0.28em] text-taupe">
        Lookbook / Editorial Study
      </p>
      <div className="relative grid items-end gap-4 md:grid-cols-[1fr_1fr]">
        <div className="relative h-[360px] overflow-hidden rounded-sm border border-surface sm:h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80"
            alt="ALT lookbook left frame"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="relative -ml-6 h-[430px] overflow-hidden rounded-sm border border-surface sm:h-[520px] md:-ml-12">
          <Image
            src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1400&q=80"
            alt="ALT lookbook right frame"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 55vw"
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <Link
          href="/lookbook"
          className="font-body text-xs uppercase tracking-[0.24em] text-gold transition hover:text-taupe"
        >
          View Lookbook
        </Link>
      </div>
    </section>
  );
}
