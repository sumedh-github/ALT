import { redirect } from "next/navigation";

import { AccountSignOutButton } from "@/app/account/account-sign-out-button";
import { AccountPageClient } from "@/components/alt/account-page-client";
import { auth } from "@/lib/auth";
import { getAccountPageData } from "@/lib/db/account";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AccountPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const accountData = await getAccountPageData(userId);
  if (!accountData.profile) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 pb-10">
      <header className="space-y-4 rounded-sm border border-surface bg-surface/20 p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.88] text-text">
            MY THEORY
          </h1>
          <AccountSignOutButton />
        </div>
        <p className="font-body text-sm text-taupe">
          {accountData.profile.name} · {accountData.profile.email}
        </p>
      </header>

      <AccountPageClient
        initialProfile={accountData.profile}
        initialOrders={accountData.orders}
        initialAddresses={accountData.addresses}
        initialWishlistProducts={accountData.wishlistProducts}
      />
    </div>
  );
}
