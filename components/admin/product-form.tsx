"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { ImageUploader } from "@/components/admin/image-uploader";

type ProductStatusValue = "DRAFT" | "ACTIVE";

interface ProductFormCategory {
  id: string;
  name: string;
}

interface ProductFormVariant {
  size: string;
  inventory: number;
}

interface ProductFormInitialData {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  status: ProductStatusValue;
  featured: boolean;
  variants: ProductFormVariant[];
  images: string[];
}

interface ProductFormProps {
  mode: "create" | "edit";
  categories: ProductFormCategory[];
  initialData?: ProductFormInitialData;
}

const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ProductForm({ mode, categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData?.slug));
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ?? categories[0]?.id ?? ""
  );
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription ?? ""
  );
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [price, setPrice] = useState((initialData?.price ?? 0) / 100);
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialData?.compareAtPrice ? initialData.compareAtPrice / 100 : 0
  );
  const [status, setStatus] = useState<ProductStatusValue>(initialData?.status ?? "DRAFT");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [variants, setVariants] = useState<ProductFormVariant[]>(
    initialData?.variants.length
      ? initialData.variants
      : defaultSizes.map((size) => ({ size, inventory: 0 }))
  );
  const [images, setImages] = useState<string[]>(
    initialData?.images.length ? initialData.images : [""]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableSizes = useMemo(
    () => defaultSizes.filter((size) => !variants.some((variant) => variant.size === size)),
    [variants]
  );

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(toSlug(value));
    }
  }

  function updateVariant(index: number, inventory: number) {
    setVariants((prev) => prev.map((item, idx) => (idx === index ? { ...item, inventory } : item)));
  }

  function addSize(size: string) {
    if (!size) return;
    setVariants((prev) => [...prev, { size, inventory: 0 }]);
  }

  function removeSize(size: string) {
    setVariants((prev) => prev.filter((item) => item.size !== size));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name,
      slug,
      categoryId,
      shortDescription,
      description,
      price: Math.round(price * 100),
      compareAtPrice: compareAtPrice > 0 ? Math.round(compareAtPrice * 100) : null,
      status,
      featured,
      variants: variants.map((variant) => ({
        size: variant.size,
        inventory: Number.isFinite(variant.inventory) ? variant.inventory : 0
      })),
      images: images.filter((image) => image.trim().length > 0)
    };

    try {
      const endpoint =
        mode === "create" ? "/api/admin/products" : `/api/admin/products/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Unable to save product.");
        toast.error(json.error ?? "Unable to save product.");
        return;
      }
      toast.success(mode === "create" ? "Product created." : "Product updated.");
      router.refresh();
      router.push("/admin/products");
    } catch (submitError) {
      console.error(submitError);
      setError("Unable to save product.");
      toast.error("Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="grid gap-4 rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Name</span>
          <input
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            required
            className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Slug</span>
          <input
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(toSlug(event.target.value));
            }}
            required
            className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Category</span>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            required
            className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Short Description</span>
          <input
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
            className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="text-[#9ca3af]">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={4}
            className="w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 py-2 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          />
        </label>
      </section>

      <section className="grid gap-4 rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5 md:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Price</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            required
            className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Compare at price</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={compareAtPrice}
            onChange={(event) => setCompareAtPrice(Number(event.target.value))}
            className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          />
        </label>
        <div className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Status</span>
          <div className="flex h-10 items-center gap-2 rounded-md border border-[#2a2d3a] bg-[#0f1117] p-1">
            {(["DRAFT", "ACTIVE"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                className={`h-8 flex-1 rounded text-xs font-medium ${
                  status === value ? "bg-[#6366f1] text-white" : "text-[#9ca3af]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <label className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Featured</span>
          <button
            type="button"
            onClick={() => setFeatured((prev) => !prev)}
            className={`h-10 w-full rounded-md border px-3 text-left text-xs ${
              featured
                ? "border-[#6366f1] bg-[#6366f1]/20 text-[#c7d2fe]"
                : "border-[#2a2d3a] bg-[#0f1117] text-[#9ca3af]"
            }`}
          >
            {featured ? "Enabled" : "Disabled"}
          </button>
        </label>
      </section>

      <section className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-[#e2e4ed]">Size Variants</p>
          <div className="flex items-center gap-2">
            <select
              defaultValue=""
              onChange={(event) => {
                addSize(event.target.value);
                event.target.value = "";
              }}
              className="h-9 rounded-md border border-[#2a2d3a] bg-[#0f1117] px-2 text-xs text-[#e2e4ed]"
            >
              <option value="">Add size</option>
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {variants.map((variant, index) => (
            <div key={variant.size} className="flex items-center gap-2 rounded-md border border-[#2a2d3a] p-2">
              <span className="w-10 text-xs font-medium text-[#9ca3af]">{variant.size}</span>
              <input
                type="number"
                min={0}
                value={variant.inventory}
                onChange={(event) => updateVariant(index, Number(event.target.value))}
                className="h-8 flex-1 rounded-md border border-[#2a2d3a] bg-[#0f1117] px-2 text-sm text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeSize(variant.size)}
                className="text-xs text-[#fca5a5] hover:text-[#ef4444]"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5">
        <p className="mb-3 text-sm font-medium text-[#e2e4ed]">Images</p>
        <ImageUploader value={images} onChange={setImages} maxImages={5} />
      </section>

      {error ? <p className="text-sm text-[#fca5a5]">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4f46e5] disabled:opacity-60"
        >
          {saving ? "Saving..." : mode === "create" ? "Create Product" : "Update Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-md border border-[#2a2d3a] px-4 py-2 text-sm text-[#9ca3af] transition hover:border-[#6366f1] hover:text-[#e2e4ed]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
