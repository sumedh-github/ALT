"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        fill="currentColor"
        d="M15.8 4.1c.7 1 1.8 1.6 3 1.8v3a6.4 6.4 0 0 1-3-.8v5.9a5.8 5.8 0 1 1-5.8-5.8c.3 0 .7 0 1 .1v3.2a2.7 2.7 0 0 0-1-.2 2.7 2.7 0 1 0 2.7 2.7V2h3.1c0 .7.2 1.4.6 2.1Z"
      />
    </svg>
  );
}

export function AltFooter() {
  return (
    <SessionProvider>
      <AltFooterContent />
    </SessionProvider>
  );
}

function AltFooterContent() {
  const { data: session, status } = useSession();
  const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

  return (
    <footer className="border-t border-surface/70 py-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-muted">
            Avero Loose Theory
          </p>
          <div className="flex-1" />
          <div className="flex items-center gap-4 text-taupe">
            <Link
              href="#"
              aria-label="Instagram"
              className="transition-colors duration-200 hover:text-gold"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href="#"
              aria-label="TikTok"
              className="transition-colors duration-200 hover:text-gold"
            >
              <TikTokIcon />
            </Link>
          </div>
        </div>
        {isAdmin ? (
          <div className="mt-4 text-right">
            <Link href="/admin" className="font-body text-[10px] text-muted">
              Admin
            </Link>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
