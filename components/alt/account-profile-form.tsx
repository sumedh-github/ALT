"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useAdminRefresh } from "@/hooks/use-admin-refresh";
import { adminPatch, ApiRequestError } from "@/lib/admin-fetch";
import { ACCOUNT_API_PATHS } from "@/lib/constants";
import { profileSchema } from "@/lib/validations/account";
import type { AccountProfileData, AccountProfileUpdateInput } from "@/types/account";

interface ProfileResponse {
  user: AccountProfileData;
}

interface AccountProfileFormProps {
  profile: AccountProfileData;
  onUpdated: (profile: AccountProfileData) => void;
}

export function AccountProfileForm({ profile, onUpdated }: AccountProfileFormProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { isPending, refresh } = useAdminRefresh();

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
  }, [profile.name, profile.email]);

  const disabled = submitting || isPending;

  const payload = useMemo<AccountProfileUpdateInput>(
    () => ({
      name: name.trim(),
      email: email.trim(),
      currentPassword: showPasswordFields ? currentPassword : undefined,
      newPassword: showPasswordFields ? newPassword : undefined,
      confirmPassword: showPasswordFields ? confirmPassword : undefined
    }),
    [name, email, showPasswordFields, currentPassword, newPassword, confirmPassword]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = profileSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error("Please check your profile details.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await adminPatch<ProfileResponse>(ACCOUNT_API_PATHS.profile, parsed.data);
      onUpdated(response.user);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
      toast.success("Profile updated.");
      refresh();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error("Unable to update profile.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-sm border border-surface bg-surface/20 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2 text-sm sm:col-span-2">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">Full Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            disabled={disabled}
            className="h-11 w-full rounded-sm border border-surface bg-black/30 px-3 font-body text-sm text-text focus:border-gold focus:outline-none disabled:opacity-60"
          />
        </label>

        <label className="space-y-2 text-sm sm:col-span-2">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={disabled || profile.emailManagedByGoogle}
            title={profile.emailManagedByGoogle ? "Email managed by Google" : undefined}
            className="h-11 w-full rounded-sm border border-surface bg-black/30 px-3 font-body text-sm text-text focus:border-gold focus:outline-none disabled:opacity-60"
          />
          {profile.emailManagedByGoogle ? (
            <p className="font-body text-xs text-muted">Email managed by Google</p>
          ) : null}
        </label>
      </div>

      <div className="border-t border-surface/70 pt-4">
        <button
          type="button"
          onClick={() => setShowPasswordFields((prev) => !prev)}
          className="font-body text-xs uppercase tracking-[0.2em] text-taupe transition hover:text-gold"
        >
          {showPasswordFields ? "Cancel Password Change" : "Change Password"}
        </button>

        {showPasswordFields ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="space-y-2 text-sm">
              <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">
                Current Password
              </span>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                disabled={disabled}
                className="h-11 w-full rounded-sm border border-surface bg-black/30 px-3 font-body text-sm text-text focus:border-gold focus:outline-none disabled:opacity-60"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">
                New Password
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                disabled={disabled}
                className="h-11 w-full rounded-sm border border-surface bg-black/30 px-3 font-body text-sm text-text focus:border-gold focus:outline-none disabled:opacity-60"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">
                Confirm Password
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={disabled}
                className="h-11 w-full rounded-sm border border-surface bg-black/30 px-3 font-body text-sm text-text focus:border-gold focus:outline-none disabled:opacity-60"
              />
            </label>
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex h-11 items-center rounded-sm border border-gold/60 px-5 font-body text-xs uppercase tracking-[0.2em] text-gold transition hover:border-gold hover:text-taupe disabled:opacity-60"
      >
        {disabled ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
