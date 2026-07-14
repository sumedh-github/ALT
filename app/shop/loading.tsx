export default function ShopLoading() {
  return (
    <div className="space-y-8 pb-8">
      <div className="space-y-3">
        <div className="h-3 w-24 animate-pulse bg-surface/60" />
        <div className="h-10 w-72 animate-pulse bg-surface/60" />
        <div className="h-4 w-full max-w-2xl animate-pulse bg-surface/60" />
      </div>
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article key={index} className="rounded-sm border border-surface bg-surface/20 p-3">
            <div className="aspect-[3/4] animate-pulse bg-surface/70" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-20 animate-pulse bg-surface/60" />
              <div className="h-7 w-48 animate-pulse bg-surface/60" />
              <div className="h-3 w-full animate-pulse bg-surface/60" />
              <div className="h-3 w-24 animate-pulse bg-surface/60" />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
