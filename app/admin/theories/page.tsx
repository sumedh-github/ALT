import Image from "next/image";
import Link from "next/link";

import { TheoryRowActions } from "@/components/admin/theory-row-actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminTheoriesPage() {
  const theories = await prisma.theory.findMany({
    include: {
      products: {
        select: { id: true }
      }
    },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#e2e4ed]">Theories</h1>
          <p className="text-sm text-[#6b7280]">{theories.length} collections</p>
        </div>
        <Link
          href="/admin/theories/new"
          className="rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4f46e5]"
        >
          Add Theory
        </Link>
      </header>

      <section className="overflow-hidden rounded-lg border border-[#2a2d3a] bg-[#1a1d27]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3a] text-xs uppercase tracking-wide text-[#6b7280]">
                <th className="px-4 py-3">Theory</th>
                <th className="px-4 py-3">Number</th>
                <th className="px-4 py-3">Season / Year</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {theories.map((theory) => (
                <tr
                  key={theory.id}
                  className={`border-b border-[#2a2d3a]/70 ${
                    theory.active ? "" : "bg-[#0f1117]/40 opacity-65"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded border border-[#2a2d3a] bg-[#0f1117]">
                        <Image
                          src={theory.image}
                          alt={theory.name}
                          fill
                          sizes="64px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-[#e2e4ed]">{theory.name}</p>
                        <p className="text-xs text-[#6b7280]">/{theory.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af]">{theory.number}</td>
                  <td className="px-4 py-3 text-[#9ca3af]">
                    {[theory.season, theory.year].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af]">{theory.products.length}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-[11px] font-medium uppercase tracking-wide ${
                        theory.active
                          ? "bg-[#22c55e]/20 text-[#86efac]"
                          : "bg-[#6b7280]/20 text-[#d1d5db]"
                      }`}
                    >
                      {theory.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <TheoryRowActions theoryId={theory.id} active={theory.active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
