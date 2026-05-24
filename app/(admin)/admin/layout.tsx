import type { ReactNode } from "react";
import Link from "next/link";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="pb-8">
      <div className="mb-6 flex items-center justify-between border-b border-surface pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">ALT Admin</p>
        <Link href="/" className="text-xs uppercase tracking-[0.2em] text-taupe hover:text-gold">
          Back to Store
        </Link>
      </div>
      {children}
    </div>
  );
}
