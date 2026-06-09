"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "sonner";

import { AccountAddressForm } from "@/components/alt/account-address-form";
import { AccountProfileForm } from "@/components/alt/account-profile-form";
import { ProductCard } from "@/components/alt/product-card";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { useAdminRefresh } from "@/hooks/use-admin-refresh";
import {
  adminDelete,
  adminDeleteJson,
  adminGet,
  adminPatch,
  adminPost,
  ApiRequestError
} from "@/lib/admin-fetch";
import { looksLikeTrackingUrl, truncateOrderId, isDeleteAccountConfirmationValid } from "@/lib/account-utils";
import { ACCOUNT_API_PATHS, ACCOUNT_SECTION_KEYS, ACCOUNT_DELETE_CONFIRM_VALUE } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist-store";
import type {
  AccountAddressData,
  AccountAddressInput,
  AccountOrderData,
  AccountProfileData
} from "@/types/account";
import type { DBProduct } from "@/types/product";

type AccountSectionKey = (typeof ACCOUNT_SECTION_KEYS)[number];

interface AccountPageClientProps {
  initialProfile: AccountProfileData;
  initialOrders: AccountOrderData[];
  initialAddresses: AccountAddressData[];
  initialWishlistProducts: DBProduct[];
}

interface AddressResponse {
  addresses: AccountAddressData[];
}

interface WishlistResponse {
  items: Array<{
    id: string;
    productId: string;
    product: DBProduct;
  }>;
}

const sectionLabels: Record<AccountSectionKey, string> = {
  profile: "Profile",
  orders: "Orders",
  addresses: "Addresses",
  wishlist: "Wishlist",
  danger: "Danger Zone"
};

const primarySectionKeys = ACCOUNT_SECTION_KEYS.filter(
  (section): section is Exclude<AccountSectionKey, "danger"> => section !== "danger"
);

export function AccountPageClient({
  initialProfile,
  initialOrders,
  initialAddresses,
  initialWishlistProducts
}: AccountPageClientProps) {
  const [activeSection, setActiveSection] = useState<AccountSectionKey>("profile");
  const [profile, setProfile] = useState(initialProfile);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressBusyKey, setAddressBusyKey] = useState<string | null>(null);
  const [wishlistProducts, setWishlistProducts] = useState(initialWishlistProducts);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmValue, setDeleteConfirmValue] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);
  const { isPending, refresh } = useAdminRefresh();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const wishlistProductIds = useWishlistStore((state) =>
    state.items.map((item) => item.productId)
  );

  const memberSinceLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      }).format(new Date(profile.createdAt)),
    [profile.createdAt]
  );

  const visibleWishlistProducts = useMemo(() => {
    const idSet = new Set(wishlistProductIds);
    return wishlistProducts.filter((product) => idSet.has(product.id));
  }, [wishlistProducts, wishlistProductIds]);

  const loadWishlist = useCallback(async () => {
    try {
      const response = await adminGet<WishlistResponse>(ACCOUNT_API_PATHS.wishlist);
      setWishlistProducts(response.items.map((item) => item.product));
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        return;
      }
      console.error(error);
    }
  }, []);

  useEffect(() => {
    void loadWishlist();
  }, [wishlistCount, loadWishlist]);

  async function handleCreateAddress(payload: AccountAddressInput) {
    setAddressBusyKey("create");
    try {
      const response = await adminPost<AddressResponse>(ACCOUNT_API_PATHS.addresses, payload);
      setAddresses(response.addresses);
      setShowAddAddress(false);
      toast.success("Address added.");
      refresh();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error("Unable to create address.");
      }
    } finally {
      setAddressBusyKey(null);
    }
  }

  async function handleUpdateAddress(addressId: string, payload: AccountAddressInput) {
    setAddressBusyKey(addressId);
    try {
      const response = await adminPatch<AddressResponse>(
        `${ACCOUNT_API_PATHS.addresses}/${addressId}`,
        payload
      );
      setAddresses(response.addresses);
      setEditingAddressId(null);
      toast.success("Address updated.");
      refresh();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error("Unable to update address.");
      }
    } finally {
      setAddressBusyKey(null);
    }
  }

  async function handleDeleteAddress(addressId: string) {
    const shouldDelete = window.confirm("Delete this address?");
    if (!shouldDelete) {
      return;
    }

    setAddressBusyKey(addressId);
    try {
      const response = await adminDeleteJson<AddressResponse>(
        `${ACCOUNT_API_PATHS.addresses}/${addressId}`
      );
      setAddresses(response.addresses);
      toast.success("Address deleted.");
      refresh();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error("Unable to delete address.");
      }
    } finally {
      setAddressBusyKey(null);
    }
  }

  async function handleSetDefaultAddress(address: AccountAddressData) {
    setAddressBusyKey(`default-${address.id}`);
    try {
      const response = await adminPatch<AddressResponse>(
        `${ACCOUNT_API_PATHS.addresses}/${address.id}`,
        { ...address, line2: address.line2 ?? "", isDefault: true }
      );
      setAddresses(response.addresses);
      toast.success("Default address updated.");
      refresh();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error("Unable to set default address.");
      }
    } finally {
      setAddressBusyKey(null);
    }
  }

  async function handleDeleteAccount() {
    if (!isDeleteAccountConfirmationValid(deleteConfirmValue)) {
      toast.error(`Type ${ACCOUNT_DELETE_CONFIRM_VALUE} to confirm.`);
      return;
    }

    setDeleteBusy(true);
    try {
      await adminDelete(ACCOUNT_API_PATHS.delete);
      toast.success("Account deleted.");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error("Unable to delete account.");
      }
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <nav className="sticky top-24 rounded-sm border border-surface bg-surface/20 p-3">
          <ul className="space-y-1">
            {primarySectionKeys.map((sectionKey) => (
              <li key={sectionKey}>
                <button
                  type="button"
                  onClick={() => setActiveSection(sectionKey)}
                  className={`w-full rounded-sm px-3 py-2 text-left font-body text-xs uppercase tracking-[0.18em] transition ${
                    activeSection === sectionKey
                      ? "bg-gold/15 text-gold"
                      : "text-muted hover:bg-surface/50 hover:text-text"
                  }`}
                >
                  {sectionLabels[sectionKey]}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="space-y-6">
        <nav className="overflow-x-auto lg:hidden">
          <div className="flex min-w-max gap-2 rounded-sm border border-surface bg-surface/20 p-2">
            {primarySectionKeys.map((sectionKey) => (
              <button
                key={sectionKey}
                type="button"
                onClick={() => setActiveSection(sectionKey)}
                className={`rounded-sm px-3 py-2 font-body text-[11px] uppercase tracking-[0.18em] ${
                  activeSection === sectionKey
                    ? "bg-gold/15 text-gold"
                    : "text-muted hover:bg-surface/50 hover:text-text"
                }`}
              >
                {sectionLabels[sectionKey]}
              </button>
            ))}
          </div>
        </nav>

        {activeSection === "profile" ? (
          <section className="space-y-4">
            <header className="space-y-2 rounded-sm border border-surface bg-surface/20 p-5">
              <h2 className="font-display text-4xl leading-none text-text">Profile</h2>
              <div className="flex flex-wrap items-center gap-3 font-body text-xs uppercase tracking-[0.18em] text-muted">
                <span>Member since {memberSinceLabel}</span>
                <span
                  className={`rounded-sm border px-2 py-1 ${
                    profile.role === "ADMIN"
                      ? "border-indigo-400/60 text-indigo-300"
                      : "border-surface text-taupe"
                  }`}
                >
                  {profile.role}
                </span>
              </div>
            </header>
            <AccountProfileForm profile={profile} onUpdated={setProfile} />
          </section>
        ) : null}

        {activeSection === "orders" ? (
          <section className="space-y-4">
            <header className="rounded-sm border border-surface bg-surface/20 p-5">
              <h2 className="font-display text-4xl leading-none text-text">Orders</h2>
            </header>

            {initialOrders.length === 0 ? (
              <div className="rounded-sm border border-surface bg-surface/20 p-6">
                <p className="font-display text-3xl italic text-text">
                  No orders yet. Start your theory.
                </p>
                <Link
                  href="/shop"
                  className="mt-4 inline-flex font-body text-xs uppercase tracking-[0.2em] text-gold transition hover:text-taupe"
                >
                  Enter Shop
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {initialOrders.map((order) => {
                  const expanded = expandedOrderId === order.id;
                  const trackingNumber = order.trackingNumber;

                  return (
                    <article key={order.id} className="rounded-sm border border-surface bg-surface/20">
                      <button
                        type="button"
                        onClick={() => setExpandedOrderId(expanded ? null : order.id)}
                        className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
                      >
                        <div className="space-y-1">
                          <p className="font-body text-xs uppercase tracking-[0.2em] text-muted">
                            {truncateOrderId(order.id)}
                          </p>
                          <p className="font-body text-sm text-taupe">
                            {new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric"
                            }).format(new Date(order.createdAt))}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <OrderStatusBadge status={order.status} />
                          <p className="font-body text-xs uppercase tracking-[0.2em] text-gold">
                            {formatCurrency(order.total / 100)}
                          </p>
                        </div>
                      </button>

                      {expanded ? (
                        <div className="space-y-4 border-t border-surface/70 p-4">
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="grid gap-3 rounded-sm border border-surface/70 bg-black/20 p-3 sm:grid-cols-[56px_minmax(0,1fr)_auto]"
                              >
                                <div className="relative h-14 w-14 overflow-hidden rounded-sm border border-surface bg-surface/30">
                                  {item.product?.images[0] ? (
                                    <Image
                                      src={item.product.images[0].url}
                                      alt={item.product.images[0].alt ?? item.name}
                                      fill
                                      unoptimized
                                      sizes="56px"
                                      className="object-cover"
                                    />
                                  ) : null}
                                </div>
                                <div className="space-y-1">
                                  <p className="font-body text-sm text-text">{item.name}</p>
                                  <p className="font-body text-xs uppercase tracking-[0.18em] text-muted">
                                    {item.size ?? "ONE SIZE"} · QTY {item.quantity}
                                  </p>
                                </div>
                                <p className="font-body text-xs uppercase tracking-[0.18em] text-gold">
                                  {formatCurrency(item.unitPrice / 100)}
                                </p>
                              </div>
                            ))}
                          </div>

                          {order.address ? (
                            <div className="rounded-sm border border-surface/70 bg-black/20 p-3">
                              <p className="font-body text-xs uppercase tracking-[0.2em] text-muted">
                                Shipping Address
                              </p>
                              <p className="mt-2 font-body text-sm text-taupe">
                                {order.address.firstName} {order.address.lastName}
                                <br />
                                {order.address.line1}
                                {order.address.line2 ? (
                                  <>
                                    <br />
                                    {order.address.line2}
                                  </>
                                ) : null}
                                <br />
                                {order.address.city}, {order.address.state} {order.address.postalCode}
                                <br />
                                {order.address.country}
                              </p>
                            </div>
                          ) : null}

                          {trackingNumber ? (
                            <p className="font-body text-xs uppercase tracking-[0.2em] text-muted">
                              Tracking:{" "}
                              {looksLikeTrackingUrl(trackingNumber) ? (
                                <a
                                  href={trackingNumber}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-gold hover:text-taupe"
                                >
                                  Open Tracking
                                </a>
                              ) : (
                                <span className="text-taupe">{trackingNumber}</span>
                              )}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        ) : null}

        {activeSection === "addresses" ? (
          <section className="space-y-4">
            <header className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-surface bg-surface/20 p-5">
              <h2 className="font-display text-4xl leading-none text-text">Addresses</h2>
              <button
                type="button"
                onClick={() => {
                  setShowAddAddress((prev) => !prev);
                  setEditingAddressId(null);
                }}
                className="inline-flex h-10 items-center rounded-sm border border-gold/60 px-4 font-body text-xs uppercase tracking-[0.2em] text-gold transition hover:border-gold hover:text-taupe"
              >
                {showAddAddress ? "Close" : "Add Address"}
              </button>
            </header>

            {showAddAddress ? (
              <AccountAddressForm
                submitLabel="Save Address"
                busy={addressBusyKey === "create" || isPending}
                onSubmit={handleCreateAddress}
                onCancel={() => setShowAddAddress(false)}
              />
            ) : null}

            <div className="space-y-3">
              {addresses.map((address) => {
                const editing = editingAddressId === address.id;
                const defaultBusy = addressBusyKey === `default-${address.id}`;
                const itemBusy = addressBusyKey === address.id || defaultBusy || isPending;

                return (
                  <article key={address.id} className="rounded-sm border border-surface bg-surface/20 p-4">
                    {editing ? (
                      <AccountAddressForm
                        initialValue={address}
                        submitLabel="Update Address"
                        busy={itemBusy}
                        onSubmit={(payload) => handleUpdateAddress(address.id, payload)}
                        onCancel={() => setEditingAddressId(null)}
                      />
                    ) : (
                      <>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-2">
                            <p className="font-body text-sm text-text">{address.name}</p>
                            <p className="font-body text-sm text-taupe">
                              {address.line1}
                              {address.line2 ? (
                                <>
                                  <br />
                                  {address.line2}
                                </>
                              ) : null}
                              <br />
                              {address.city}, {address.state} {address.zip}
                              <br />
                              {address.country}
                            </p>
                          </div>

                          {address.isDefault ? (
                            <span className="rounded-sm border border-gold/60 px-2 py-1 font-body text-[10px] uppercase tracking-[0.18em] text-gold">
                              Default
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setEditingAddressId(address.id)}
                            disabled={itemBusy}
                            className="font-body text-xs uppercase tracking-[0.2em] text-taupe transition hover:text-gold disabled:opacity-60"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteAddress(address.id)}
                            disabled={itemBusy}
                            className="font-body text-xs uppercase tracking-[0.2em] text-red-300 transition hover:text-red-200 disabled:opacity-60"
                          >
                            Delete
                          </button>
                          {!address.isDefault ? (
                            <button
                              type="button"
                              onClick={() => void handleSetDefaultAddress(address)}
                              disabled={itemBusy}
                              className="font-body text-xs uppercase tracking-[0.2em] text-muted transition hover:text-gold disabled:opacity-60"
                            >
                              {defaultBusy ? "Updating..." : "Set as Default"}
                            </button>
                          ) : null}
                        </div>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {activeSection === "wishlist" ? (
          <section className="space-y-4">
            <header className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-surface bg-surface/20 p-5">
              <h2 className="font-display text-4xl leading-none text-text">Wishlist</h2>
              <button
                type="button"
                onClick={() => void loadWishlist()}
                className="font-body text-xs uppercase tracking-[0.2em] text-muted transition hover:text-gold"
              >
                Refresh
              </button>
            </header>

            {visibleWishlistProducts.length === 0 ? (
              <div className="rounded-sm border border-surface bg-surface/20 p-6">
                <p className="font-display text-3xl italic text-text">No pieces saved yet.</p>
                <Link
                  href="/shop"
                  className="mt-4 inline-flex font-body text-xs uppercase tracking-[0.2em] text-gold transition hover:text-taupe"
                >
                  Enter Shop
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleWishlistProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        ) : null}

        <section className="space-y-4 rounded-sm border border-red-500/40 bg-red-950/20 p-5">
          <h2 className="font-display text-4xl leading-none text-text">Danger Zone</h2>
          <p className="font-body text-sm text-red-200/80">
            Delete your account and all associated data permanently.
          </p>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex h-10 items-center rounded-sm border border-red-400/60 px-4 font-body text-xs uppercase tracking-[0.2em] text-red-200 transition hover:border-red-300 hover:text-red-100"
          >
            Delete Account
          </button>
        </section>
      </div>

      {deleteModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-sm border border-red-500/40 bg-[#111217] p-5">
            <h3 className="font-display text-3xl leading-none text-text">Delete Account</h3>
            <p className="mt-3 font-body text-sm text-taupe">
              This will permanently delete your account and all associated data. This cannot be
              undone.
            </p>
            <label className="mt-4 block space-y-2">
              <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">
                Type {ACCOUNT_DELETE_CONFIRM_VALUE} to confirm
              </span>
              <input
                value={deleteConfirmValue}
                onChange={(event) => setDeleteConfirmValue(event.target.value)}
                className="h-11 w-full rounded-sm border border-surface bg-black/30 px-3 font-body text-sm text-text focus:border-gold focus:outline-none"
              />
            </label>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteConfirmValue("");
                }}
                disabled={deleteBusy}
                className="inline-flex h-10 items-center rounded-sm border border-surface px-4 font-body text-xs uppercase tracking-[0.2em] text-muted transition hover:border-gold hover:text-gold disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteAccount()}
                disabled={deleteBusy || !isDeleteAccountConfirmationValid(deleteConfirmValue)}
                className="inline-flex h-10 items-center rounded-sm border border-red-400/60 px-4 font-body text-xs uppercase tracking-[0.2em] text-red-200 transition hover:border-red-300 hover:text-red-100 disabled:opacity-60"
              >
                {deleteBusy ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <Toaster position="bottom-right" theme="dark" />
    </section>
  );
}
