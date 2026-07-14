"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { DEFAULT_ADDRESS_COUNTRY } from "@/lib/constants";
import { addressSchema } from "@/lib/validations/account";
import type { AccountAddressData, AccountAddressInput } from "@/types/account";

interface AccountAddressFormProps {
  initialValue?: AccountAddressData;
  submitLabel: string;
  busy?: boolean;
  onSubmit: (payload: AccountAddressInput) => Promise<void>;
  onCancel?: () => void;
}

export function AccountAddressForm({
  initialValue,
  submitLabel,
  busy = false,
  onSubmit,
  onCancel
}: AccountAddressFormProps) {
  const [name, setName] = useState(initialValue?.name ?? "");
  const [line1, setLine1] = useState(initialValue?.line1 ?? "");
  const [line2, setLine2] = useState(initialValue?.line2 ?? "");
  const [city, setCity] = useState(initialValue?.city ?? "");
  const [state, setState] = useState(initialValue?.state ?? "");
  const [zip, setZip] = useState(initialValue?.zip ?? "");
  const [country, setCountry] = useState(initialValue?.country ?? DEFAULT_ADDRESS_COUNTRY);
  const [isDefault, setIsDefault] = useState(initialValue?.isDefault ?? false);

  const payload = useMemo<AccountAddressInput>(
    () => ({
      name: name.trim(),
      line1: line1.trim(),
      line2: line2.trim() || null,
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
      country: country.trim() || DEFAULT_ADDRESS_COUNTRY,
      isDefault
    }),
    [name, line1, line2, city, state, zip, country, isDefault]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = addressSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error("Please complete all required address fields.");
      return;
    }

    await onSubmit(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-sm border border-surface/80 bg-black/20 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2 text-sm sm:col-span-2">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            disabled={busy}
            className="h-11 w-full rounded-sm border border-surface bg-black/20 px-3 font-body text-sm text-text focus:border-gold focus:outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm sm:col-span-2">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">
            Address Line 1
          </span>
          <input
            value={line1}
            onChange={(event) => setLine1(event.target.value)}
            required
            disabled={busy}
            className="h-11 w-full rounded-sm border border-surface bg-black/20 px-3 font-body text-sm text-text focus:border-gold focus:outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm sm:col-span-2">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">
            Address Line 2
          </span>
          <input
            value={line2}
            onChange={(event) => setLine2(event.target.value)}
            disabled={busy}
            className="h-11 w-full rounded-sm border border-surface bg-black/20 px-3 font-body text-sm text-text focus:border-gold focus:outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">City</span>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            required
            disabled={busy}
            className="h-11 w-full rounded-sm border border-surface bg-black/20 px-3 font-body text-sm text-text focus:border-gold focus:outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">State</span>
          <input
            value={state}
            onChange={(event) => setState(event.target.value)}
            required
            disabled={busy}
            className="h-11 w-full rounded-sm border border-surface bg-black/20 px-3 font-body text-sm text-text focus:border-gold focus:outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">ZIP</span>
          <input
            value={zip}
            onChange={(event) => setZip(event.target.value)}
            required
            disabled={busy}
            className="h-11 w-full rounded-sm border border-surface bg-black/20 px-3 font-body text-sm text-text focus:border-gold focus:outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">Country</span>
          <input
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            required
            disabled={busy}
            className="h-11 w-full rounded-sm border border-surface bg-black/20 px-3 font-body text-sm text-text focus:border-gold focus:outline-none disabled:opacity-60"
          />
        </label>
      </div>

      <label className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.18em] text-muted">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(event) => setIsDefault(event.target.checked)}
          disabled={busy}
          className="accent-gold"
        />
        Set as default
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-10 items-center rounded-sm border border-gold/60 px-4 font-body text-xs uppercase tracking-[0.2em] text-gold transition hover:border-gold hover:text-taupe disabled:opacity-60"
        >
          {busy ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex h-10 items-center rounded-sm border border-surface px-4 font-body text-xs uppercase tracking-[0.2em] text-muted transition hover:border-gold hover:text-gold disabled:opacity-60"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
