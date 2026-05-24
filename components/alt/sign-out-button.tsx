"use client";

import { signOut } from "next-auth/react";

import { AltButton } from "@/components/alt/alt-button";

export function SignOutButton() {
  return (
    <AltButton variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </AltButton>
  );
}
