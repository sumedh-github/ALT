"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

interface ProductFilterCategory {
  id: string;
  name: string;
}

interface ProductsFiltersProps {
  categories: ProductFilterCategory[];
  currentQuery: string;
  currentCategory: string;
  currentStatus: string;
}

export function ProductsFilters({
  categories,
  currentQuery,
  currentCategory,
  currentStatus
}: ProductsFiltersProps) {
  const [query, setQuery] = useState(currentQuery);
  const [categoryId, setCategoryId] = useState(currentCategory);
  const [status, setStatus] = useState(currentStatus);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const paramString = useMemo(() => searchParams.toString(), [searchParams]);

  function applyFilters() {
    const params = new URLSearchParams(paramString);
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    if (categoryId && categoryId !== "ALL") {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    if (status && status !== "ALL") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="grid gap-3 rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-4 md:grid-cols-[1fr_180px_160px_auto]">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products"
        className="h-10 rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-sm text-[#e2e4ed] placeholder:text-[#6b7280] focus:border-[#6366f1] focus:outline-none"
      />
      <select
        value={categoryId}
        onChange={(event) => setCategoryId(event.target.value)}
        className="h-10 rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-sm text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
      >
        <option value="ALL">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className="h-10 rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-sm text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
      >
        <option value="ALL">All status</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="DRAFT">DRAFT</option>
        <option value="DELETED">DELETED</option>
      </select>
      <button
        type="button"
        onClick={applyFilters}
        className="h-10 rounded-md bg-[#6366f1] px-4 text-sm font-medium text-white transition hover:bg-[#4f46e5]"
      >
        Apply
      </button>
    </div>
  );
}
