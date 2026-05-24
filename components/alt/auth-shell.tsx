import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  body: string;
  children: ReactNode;
};

export function AuthShell({ eyebrow, title, body, children }: AuthShellProps) {
  return (
    <section className="mx-auto max-w-lg pb-8 pt-8">
      <div className="noise-overlay rounded-sm border border-surface bg-surface/25 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-taupe">{eyebrow}</p>
        <h1 className="mt-3 font-display text-5xl leading-[0.9]">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-taupe">{body}</p>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
