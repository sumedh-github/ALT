"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, LogOut, Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { CartDrawer } from "@/components/alt/cart-drawer";
import { useCartSummary } from "@/hooks/use-cart-summary";
import { useWishlistSummary } from "@/hooks/use-wishlist-summary";
import { useWishlistSync } from "@/hooks/use-wishlist-sync";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUiStore } from "@/store/ui-store";

interface NavTheory {
  id: string;
  slug: string;
  number: string;
  name: string;
}

const desktopLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/theories", label: "Theories" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" }
];

export function AltNavbar() {
  return (
    <SessionProvider>
      <AltNavbarContent />
    </SessionProvider>
  );
}

function AltNavbarContent() {
  const [mounted, setMounted] = useState(false);
  const [theoriesOpen, setTheoriesOpen] = useState(false);
  const [mobileTheoriesOpen, setMobileTheoriesOpen] = useState(false);
  const [theories, setTheories] = useState<NavTheory[]>([]);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";
  const displayName = session?.user?.name?.trim() || "ALT";
  const { quantity } = useCartSummary();
  const { count } = useWishlistSummary();
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const mobileMenuOpen = useUiStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useWishlistSync(status);

  useEffect(() => {
    let active = true;
    async function loadTheories() {
      try {
        const response = await fetch("/api/theories", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const json = (await response.json()) as {
          theories?: Array<{ id: string; slug: string; number: string; name: string }>;
        };
        if (active) {
          setTheories(json.theories ?? []);
        }
      } catch (error) {
        console.error(error);
      }
    }
    void loadTheories();
    return () => {
      active = false;
    };
  }, []);

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
          <Link
            href="/shop"
            className="font-body text-[13px] font-medium uppercase tracking-widest text-text transition-colors duration-200 hover:text-gold"
          >
            Shop
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setTheoriesOpen(true)}
            onMouseLeave={() => setTheoriesOpen(false)}
          >
            <Link
              href="/theories"
              className="font-body text-[13px] font-medium uppercase tracking-widest text-text transition-colors duration-200 hover:text-gold"
            >
              Theories
            </Link>

            <AnimatePresence>
              {theoriesOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-1/2 top-full z-40 mt-3 min-w-[300px] -translate-x-1/2 rounded-sm border border-white/10 bg-[#1a1e24] p-4 shadow-luxe"
                >
                  <div className="space-y-2">
                    {theories.map((theory) => (
                      <Link
                        key={theory.id}
                        href={`/theories/${theory.slug}`}
                        className="block font-display text-2xl italic leading-none text-text transition-colors duration-200 hover:text-gold"
                      >
                        {theory.number.replace("THEORY", "Theory")} — {theory.name}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-white/10 pt-3">
                    <Link
                      href="/theories"
                      className="font-body text-[11px] uppercase tracking-[0.2em] text-muted transition-colors duration-200 hover:text-gold"
                    >
                      View All Theories
                    </Link>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {desktopLinks
            .filter((link) => link.label !== "Shop" && link.label !== "Theories")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-[13px] font-medium uppercase tracking-widest text-text transition-colors duration-200 hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/account"
                className="hidden font-body text-[11px] tracking-widest text-muted transition-colors duration-200 hover:text-gold sm:inline-block"
              >
                HI, {displayName}
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="hidden rounded-sm border border-[#6366f1]/60 px-2 py-1 font-body text-[10px] uppercase tracking-[0.18em] text-[#6366f1] sm:inline-block"
                >
                  ADMIN
                </Link>
              ) : null}
              <button
                type="button"
                className="hidden p-1 text-gold transition hover:text-taupe sm:inline-flex"
                onClick={() => {
                  clearWishlist();
                  void signOut({ callbackUrl: "/" });
                }}
                aria-label="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden font-body text-[11px] uppercase tracking-widest text-muted transition-colors duration-200 hover:text-gold sm:inline-block"
            >
              LOGIN
            </Link>
          )}

          <Link
            href="/wishlist"
            className="relative p-1 text-gold transition hover:text-taupe"
            aria-label="Open wishlist"
          >
            <Heart size={22} />
            {mounted && count > 0 ? (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-gold px-1 text-center text-[10px] text-bg">
                {count}
              </span>
            ) : null}
          </Link>

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
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-white/10 bg-black/70 px-4 pb-4 pt-3 backdrop-blur-md sm:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/shop"
              className="font-body text-[13px] font-medium uppercase tracking-widest text-text transition-colors duration-200 hover:text-gold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>

            <button
              type="button"
              onClick={() => setMobileTheoriesOpen((prev) => !prev)}
              className="flex items-center justify-between font-body text-[13px] font-medium uppercase tracking-widest text-text transition-colors duration-200 hover:text-gold"
              aria-expanded={mobileTheoriesOpen}
              aria-controls="mobile-theories-list"
            >
              Theories
              <ChevronDown
                size={16}
                className={`transition-transform ${mobileTheoriesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileTheoriesOpen ? (
              <div id="mobile-theories-list" className="space-y-2 pl-3">
                {theories.map((theory) => (
                  <Link
                    key={theory.id}
                    href={`/theories/${theory.slug}`}
                    className="block font-display text-2xl italic leading-none text-taupe transition-colors duration-200 hover:text-gold"
                    onClick={() => {
                      setMobileTheoriesOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {theory.number.replace("THEORY", "Theory")} — {theory.name}
                  </Link>
                ))}
                <Link
                  href="/theories"
                  className="block pt-1 font-body text-[11px] uppercase tracking-[0.2em] text-muted transition-colors duration-200 hover:text-gold"
                  onClick={() => {
                    setMobileTheoriesOpen(false);
                    setMobileMenuOpen(false);
                  }}
                >
                  View All Theories
                </Link>
              </div>
            ) : null}

            {desktopLinks
              .filter((link) => link.label !== "Shop" && link.label !== "Theories")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-[13px] font-medium uppercase tracking-widest text-text transition-colors duration-200 hover:text-gold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

            <div className="mt-2 border-t border-white/10 pt-3">
              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/account"
                    className="font-body text-[13px] font-medium uppercase tracking-widest text-text transition-colors duration-200 hover:text-gold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      className="font-body text-[12px] uppercase tracking-[0.18em] text-[#6366f1]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className="text-left font-body text-[13px] font-medium uppercase tracking-widest text-red-300/80 transition-colors duration-200 hover:text-red-200"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      clearWishlist();
                      void signOut({ callbackUrl: "/" });
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="font-body text-[13px] font-medium uppercase tracking-widest text-text transition-colors duration-200 hover:text-gold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="font-body text-[13px] font-medium uppercase tracking-widest text-text transition-colors duration-200 hover:text-gold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      <CartDrawer />
    </header>
  );
}
