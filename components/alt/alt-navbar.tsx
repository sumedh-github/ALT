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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-1 text-white transition hover:text-gold sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Menu size={24} />
          </button>
          <Link
            href="/"
            className="font-display text-[28px] font-semibold uppercase leading-none tracking-[0.2em] text-gold"
          >
            ALT
          </Link>
        </div>

        <nav className="hidden items-center gap-7 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-[13px] font-medium uppercase tracking-widest text-text transition-colors duration-200 hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="relative p-1 text-gold transition hover:text-taupe"
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
        >
          <ShoppingBag size={22} />
          {quantity > 0 ? (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-gold px-1 text-center text-[10px] text-bg">
              {quantity}
            </span>
          ) : null}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-white/10 bg-black/70 px-4 pb-4 pt-3 backdrop-blur-md sm:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-[13px] font-medium uppercase tracking-widest text-text transition-colors duration-200 hover:text-gold"
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
