"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { ImageUploader } from "@/components/admin/image-uploader";

interface TheoryProductOption {
  id: string;
  name: string;
  image: string | null;
}

interface TheoryFormInitialData {
  id: string;
  number: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  season: string;
  year: number | null;
  image: string;
  active: boolean;
  productIds: string[];
}

interface TheoryFormProps {
  mode: "create" | "edit";
  products: TheoryProductOption[];
  initialData?: TheoryFormInitialData;
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function TheoryForm({ mode, products, initialData }: TheoryFormProps) {
  const router = useRouter();
  const [number, setNumber] = useState(initialData?.number ?? "");
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData?.slug));
  const [tagline, setTagline] = useState(initialData?.tagline ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [season, setSeason] = useState(initialData?.season ?? "");
  const [year, setYear] = useState(initialData?.year ? String(initialData.year) : "");
  const [image, setImage] = useState(initialData?.image ? [initialData.image] : []);
  const [active, setActive] = useState(initialData?.active ?? true);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    initialData?.productIds ?? []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(toSlug(value));
    }
  }

  function toggleProduct(id: string) {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!image[0]) {
      setError("Please upload a hero image.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const endpoint =
        mode === "create" ? "/api/admin/theories" : `/api/admin/theories/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: number.trim(),
          name: name.trim(),
          slug: slug.trim(),
          tagline: tagline.trim(),
          description,
          season: season.trim(),
          year: year === "" ? null : Number.parseInt(year, 10),
          image: image[0],
          active,
          productIds: selectedProductIds ?? []
        })
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Unable to save theory.");
        return;
      }
      router.push("/admin/theories");
      router.refresh();
    } catch (submitError) {
      console.error(submitError);
      setError("Unable to save theory.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="grid gap-4 rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Number</span>
          <input
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            placeholder="THEORY 001"
            required
            className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Name</span>
          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
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
          <span className="text-[#9ca3af]">Tagline</span>
          <input
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Season</span>
          <input
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Year</span>
          <input
            type="number"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="h-10 w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-[#9ca3af]">Status</span>
          <button
            type="button"
            onClick={() => setActive((prev) => !prev)}
            className={`h-10 w-full rounded-md border px-3 text-left text-xs ${
              active
                ? "border-[#22c55e] bg-[#22c55e]/15 text-[#86efac]"
                : "border-[#2a2d3a] bg-[#0f1117] text-[#9ca3af]"
            }`}
          >
            {active ? "ACTIVE" : "DRAFT"}
          </button>
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="text-[#9ca3af]">Hero image</span>
          <ImageUploader value={image} onChange={setImage} maxImages={1} />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="text-[#9ca3af]">Description (minimum 500 characters)</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={8}
            required
            minLength={500}
            className="w-full rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 py-2 text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          />
          <p className="text-xs text-[#6b7280]">{description.length}/500</p>
        </label>
      </section>

      <section className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5">
        <p className="mb-3 text-sm font-medium text-[#e2e4ed]">Products in this theory</p>
        <div className="grid gap-2 md:grid-cols-2">
          {products.map((product) => {
            const checked = selectedProductIds.includes(product.id);
            return (
              <label
                key={product.id}
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-2 ${
                  checked
                    ? "border-[#6366f1] bg-[#6366f1]/10"
                    : "border-[#2a2d3a] bg-[#0f1117]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleProduct(product.id)}
                  className="accent-[#6366f1]"
                />
                <div className="relative h-11 w-10 overflow-hidden rounded border border-[#2a2d3a] bg-[#0f1117]">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <span className="text-sm text-[#e2e4ed]">{product.name}</span>
              </label>
            );
          })}
        </div>
      </section>

      {error ? <p className="text-sm text-[#fca5a5]">{error}</p> : null}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4f46e5] disabled:opacity-60"
        >
          {saving ? "Saving..." : mode === "create" ? "Create Theory" : "Update Theory"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/theories")}
          className="rounded-md border border-[#2a2d3a] px-4 py-2 text-sm text-[#9ca3af] transition hover:border-[#6366f1] hover:text-[#e2e4ed]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
