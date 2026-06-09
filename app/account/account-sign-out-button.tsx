"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function AccountSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-2 font-body text-[12px] uppercase tracking-widest text-muted transition-colors duration-200 hover:text-gold"
      aria-label="Sign out"
    >
      <LogOut size={18} />
      Sign Out
    </button>
  );
}
