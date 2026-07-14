import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminNotAuthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0f1117] px-6">
      <section className="w-full max-w-xl rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-8 text-center">
        <h1 className="text-3xl font-semibold text-[#e2e4ed]">Access Restricted</h1>
        <p className="mt-3 text-sm text-[#9ca3af]">
          This area is for authorized personnel only.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4f46e5]"
        >
          Back to Homepage
        </Link>
      </section>
    </main>
  );
}
