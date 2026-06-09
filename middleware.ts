import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isAuthenticated = Boolean(req.auth?.user);
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute =
    pathname.startsWith("/account") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/order");

  if (isAdminRoute) {
    if (!isAuthenticated || req.auth?.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
  }

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/order/:path*", "/admin/:path*"]
};
