"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type StockFilter = "ALL" | "LOW_STOCK" | "OUT_OF_STOCK";

interface InventoryVariant {
  id: string;
  size: string;
  inventory: number;
}

interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  variants: InventoryVariant[];
}

interface InventoryPanelProps {
  products: InventoryProduct[];
}

const trackedSizes = ["XS", "S", "M", "L", "XL", "XXL"];

function cellColor(inventory: number) {
  if (inventory === 0) {
    return "bg-[#ef4444]/20 text-[#fca5a5]";
  }
  if (inventory < 5) {
    return "bg-[#f59e0b]/20 text-[#fcd34d]";
  }
  return "bg-[#22c55e]/20 text-[#86efac]";
}

export function InventoryPanel({ products }: InventoryPanelProps) {
  const [filter, setFilter] = useState<StockFilter>("ALL");
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [savingVariantId, setSavingVariantId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    if (filter === "ALL") {
      return products;
    }
    return products.filter((product) => {
      const values = product.variants.map((variant) => variant.inventory);
      if (filter === "OUT_OF_STOCK") {
        return values.some((value) => value === 0);
      }
      return values.some((value) => value > 0 && value < 5);
    });
  }, [filter, products]);

  async function saveInventory(variantId: string) {
    const numericValue = Number(editingValue);
    if (!Number.isFinite(numericValue) || numericValue < 0) {
      setEditingVariantId(null);
      return;
    }
    setSavingVariantId(variantId);
    try {
      const response = await fetch(`/api/admin/inventory/${variantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventory: Math.round(numericValue) })
      });
      if (!response.ok) {
        throw new Error("Unable to update inventory");
      }
      toast.success("Inventory updated.");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Unable to update inventory.");
    } finally {
      setEditingVariantId(null);
      setSavingVariantId(null);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#e2e4ed]">Inventory</h1>
          <p className="text-sm text-[#6b7280]">Variant-level stock matrix</p>
        </div>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as StockFilter)}
          className="h-10 rounded-md border border-[#2a2d3a] bg-[#1a1d27] px-3 text-sm text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
        >
          <option value="ALL">All</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </header>

      <section className="overflow-hidden rounded-lg border border-[#2a2d3a] bg-[#1a1d27]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3a] text-xs uppercase tracking-wide text-[#6b7280]">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                {trackedSizes.map((size) => (
                  <th key={size} className="px-2 py-3 text-center">
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-[#2a2d3a]/70">
                  <td className="px-4 py-3 text-[#e2e4ed]">{product.name}</td>
                  <td className="px-4 py-3 text-[#9ca3af]">{product.category}</td>
                  {trackedSizes.map((size) => {
                    const variant = product.variants.find((entry) => entry.size === size);
                    const value = variant?.inventory ?? 0;
                    const isEditing = editingVariantId === variant?.id;
                    return (
                      <td key={`${product.id}-${size}`} className="px-2 py-3 text-center">
                        {variant && isEditing ? (
                          <input
                            type="number"
                            min={0}
                            value={editingValue}
                            onChange={(event) => setEditingValue(event.target.value)}
                            onBlur={() => void saveInventory(variant.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                void saveInventory(variant.id);
                              }
                            }}
                            autoFocus
                            className="h-8 w-14 rounded-md border border-[#6366f1] bg-[#0f1117] px-2 text-center text-sm text-[#e2e4ed] focus:outline-none"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (!variant) return;
                              setEditingVariantId(variant.id);
                              setEditingValue(String(variant.inventory));
                            }}
                            className={`inline-flex min-w-12 items-center justify-center rounded-md px-2 py-1 text-xs font-medium ${cellColor(
                              value
                            )}`}
                            disabled={savingVariantId === variant?.id}
                          >
                            {savingVariantId === variant?.id ? "Saving..." : value}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
