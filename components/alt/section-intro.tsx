type SectionIntroProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export function SectionIntro({ eyebrow, title, body }: SectionIntroProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-[0.3em] text-taupe">{eyebrow}</p>
      <h2 className="mt-2 font-display text-4xl leading-none sm:text-5xl">{title}</h2>
      <p className="mt-4 text-sm leading-relaxed text-taupe sm:text-base">{body}</p>
    </div>
  );
}
