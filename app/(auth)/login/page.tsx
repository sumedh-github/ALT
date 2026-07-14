import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { LoginClientPage } from "./page-client";

interface LoginPageProps {
  searchParams?: {
    callbackUrl?: string | string[];
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/");
  }

  const callbackUrl =
    typeof searchParams?.callbackUrl === "string" ? searchParams.callbackUrl : "/";

  return <LoginClientPage callbackUrl={callbackUrl} />;
}
