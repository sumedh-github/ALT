import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  if (!req.auth?.user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (pathname.startsWith("/admin") && req.auth.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/admin/:path*"]
};
