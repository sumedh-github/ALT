import Image from "next/image";
import Link from "next/link";
import type { Prisma, ProductStatus } from "@prisma/client";

import { ProductRowActions } from "@/components/admin/product-row-actions";
import { ProductsFilters } from "@/components/admin/products-filters";
import { ProductStatusBadge } from "@/components/admin/product-status-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

interface ProductsPageProps {
  searchParams?: {
    q?: string;
    category?: string;
    status?: string;
    page?: string;
  };
}

const PAGE_SIZE = 20;

function buildPageHref(params: URLSearchParams, page: number) {
  const nextParams = new URLSearchParams(params.toString());
  nextParams.set("page", String(page));
  return `/admin/products?${nextParams.toString()}`;
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const query = searchParams?.q ?? "";
  const categoryId = searchParams?.category ?? "ALL";
  const rawStatus = searchParams?.status ?? "ALL";
  const page = Number(searchParams?.page ?? "1") || 1;
  const status =
    rawStatus === "ACTIVE" || rawStatus === "DRAFT" ? (rawStatus as ProductStatus) : "ALL";

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  });

  const where: Prisma.ProductWhereInput = {
    ...(query
      ? {
          name: {
            contains: query,
            mode: "insensitive"
          }
        }
      : {}),
    ...(categoryId !== "ALL" ? { categoryId } : {}),
    ...(status !== "ALL" ? { status } : {})
  };

  const [totalProducts, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: { name: true }
        },
        variants: {
          select: { id: true, inventory: true }
        },
        images: {
          select: { id: true, url: true, position: true },
          orderBy: { position: "asc" }
        }
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    })
  ]);

  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (categoryId !== "ALL") params.set("category", categoryId);
  if (status !== "ALL") params.set("status", status);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#e2e4ed]">Products</h1>
          <p className="text-sm text-[#6b7280]">{totalProducts} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4f46e5]"
        >
          Add Product
        </Link>
      </header>

      <ProductsFilters
        categories={categories}
        currentCategory={categoryId}
        currentQuery={query}
        currentStatus={status}
      />

      <section className="overflow-hidden rounded-lg border border-[#2a2d3a] bg-[#1a1d27]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3a] text-xs uppercase tracking-wide text-[#6b7280]">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Inventory</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const inventory = product.variants.reduce(
                  (total, variant) => total + variant.inventory,
                  0
                );
                const thumbnail = product.images[0]?.url ?? "";
                return (
                  <tr key={product.id} className="border-b border-[#2a2d3a]/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 overflow-hidden rounded border border-[#2a2d3a] bg-[#0f1117]">
                          {thumbnail ? (
                            <Image
                              src={thumbnail}
                              alt={product.name}
                              fill
                              sizes="40px"
                              unoptimized
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-medium text-[#e2e4ed]">{product.name}</p>
                          <p className="text-xs text-[#6b7280]">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#9ca3af]">{product.category.name}</td>
                    <td className="px-4 py-3 text-[#e2e4ed]">{formatCurrency(product.price / 100)}</td>
                    <td className="px-4 py-3 text-[#9ca3af]">{inventory}</td>
                    <td className="px-4 py-3">
                      <ProductStatusBadge status={product.status} />
                    </td>
                    <td className="px-4 py-3">
                      <ProductRowActions productId={product.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {products.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[#6b7280]">No products found.</p>
        ) : null}
      </section>

      <div className="flex items-center justify-between text-sm">
        <p className="text-[#6b7280]">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Link
            href={buildPageHref(params, Math.max(1, currentPage - 1))}
            className="rounded-md border border-[#2a2d3a] px-3 py-2 text-[#9ca3af] transition hover:border-[#6366f1] hover:text-[#e2e4ed]"
          >
            Previous
          </Link>
          <Link
            href={buildPageHref(params, Math.min(totalPages, currentPage + 1))}
            className="rounded-md border border-[#2a2d3a] px-3 py-2 text-[#9ca3af] transition hover:border-[#6366f1] hover:text-[#e2e4ed]"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
