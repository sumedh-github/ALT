"use client";

import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";

import { CartDrawer } from "@/components/alt/cart-drawer";
import { useCartSummary } from "@/hooks/use-cart-summary";
import { useUiStore } from "@/store/ui-store";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" }
];

export function AltNavbar() {
  const { quantity } = useCartSummary();
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const mobileMenuOpen = useUiStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);

  return (
    <header className="sticky top-0 z-30 border-b border-surface/80 bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-sm border border-surface p-2 text-taupe transition hover:border-gold hover:text-gold sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={16} />
          </button>
          <Link href="/" className="font-display text-2xl leading-none tracking-wide">
            ALT
          </Link>
        </div>

        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-taupe transition hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="relative rounded-sm border border-surface p-2 text-taupe transition hover:border-gold hover:text-gold"
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
        >
          <ShoppingBag size={16} />
          {quantity > 0 ? (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-gold px-1 text-center text-[10px] text-bg">
              {quantity}
            </span>
          ) : null}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-surface bg-bg px-4 pb-4 pt-3 sm:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.2em] text-taupe transition hover:text-gold"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      <CartDrawer />
    </header>
  );
}
