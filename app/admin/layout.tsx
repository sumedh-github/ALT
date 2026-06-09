import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { AdminShell } from "@/components/admin/admin-shell";
import { auth } from "@/lib/auth";

interface AdminLayoutProps {
  children: ReactNode;
}

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return <div className="min-h-screen bg-[#0f1117]">{children}</div>;
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-auto bg-[#0f1117]">
      <AdminShell userEmail={session.user.email ?? "admin@averolosetheory.com"}>
        {children}
      </AdminShell>
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}
