"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Box,
  Layers,
  ShoppingCart,
  Users,
  TicketPercent,
  LogOut,
  Menu,
  X
} from "lucide-react";

import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: ReactNode;
  userEmail: string;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Box },
  { href: "/admin/theories", label: "Theories", icon: Layers },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/discounts", label: "Discounts", icon: TicketPercent }
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const content = useMemo(
    () => (
      <div className="space-y-6 px-4 py-5 md:space-y-8 md:px-8 md:py-8">
        {children}
      </div>
    ),
    [children]
  );

  return (
    <div className="min-h-screen bg-[#0f1117] font-body text-[#e2e4ed]">
      <aside className="fixed inset-y-0 left-0 hidden w-[240px] border-r border-[#2a2d3a] bg-[#1a1d27] md:flex md:flex-col">
        <div className="border-b border-[#2a2d3a] px-5 py-5">
          <p className="text-base font-semibold tracking-[0.14em] text-[#e2e4ed]">ALT</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#6366f1]">
            Admin
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-[#6366f1]/20 text-[#e2e4ed]"
                    : "text-[#9ca3af] hover:bg-[#2a2d3a]/50 hover:text-[#e2e4ed]"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#2a2d3a] px-4 py-4">
          <p className="truncate text-xs text-[#6b7280]">{userEmail}</p>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-3 inline-flex items-center gap-2 text-xs text-[#9ca3af] transition hover:text-[#e2e4ed]"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-[#2a2d3a] bg-[#1a1d27] px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.14em]">ALT</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6366f1]">Admin</p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-md border border-[#2a2d3a] p-2 text-[#e2e4ed]"
            aria-label="Toggle admin menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen ? (
          <nav className="mt-3 space-y-1 border-t border-[#2a2d3a] pt-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                    active
                      ? "bg-[#6366f1]/20 text-[#e2e4ed]"
                      : "text-[#9ca3af] hover:bg-[#2a2d3a]/50 hover:text-[#e2e4ed]"
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t border-[#2a2d3a] pt-3">
              <p className="truncate text-xs text-[#6b7280]">{userEmail}</p>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="mt-2 inline-flex items-center gap-2 text-xs text-[#9ca3af] transition hover:text-[#e2e4ed]"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="md:pl-[240px]">{content}</main>
    </div>
  );
}
