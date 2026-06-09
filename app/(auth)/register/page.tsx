import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { RegisterClientPage } from "./page-client";

interface RegisterPageProps {
  searchParams?: {
    callbackUrl?: string | string[];
  };
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  const callbackUrl =
    typeof searchParams?.callbackUrl === "string" ? searchParams.callbackUrl : "/";

  return <RegisterClientPage callbackUrl={callbackUrl} />;
}
