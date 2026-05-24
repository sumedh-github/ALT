type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
};

export function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <article className="rounded-sm border border-surface bg-surface/40 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-3 font-display text-4xl leading-none text-text">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.15em] text-taupe">{helper}</p>
    </article>
  );
}
