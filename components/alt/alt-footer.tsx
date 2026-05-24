import Link from "next/link";

const footerLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
  { href: "/cart", label: "Cart" }
];

export function AltFooter() {
  return (
    <footer className="border-t border-surface py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-3xl">Avero Loose Theory</p>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-taupe">
            The Oversized Theory
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-muted transition hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
