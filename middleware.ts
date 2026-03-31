import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_CHECKOUT_DOMAIN = process.env.SHOPIFY_CHECKOUT_DOMAIN;

export function middleware(request: NextRequest) {
  if (!SHOPIFY_CHECKOUT_DOMAIN) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const isCheckoutPath =
    pathname.startsWith("/cart/") ||
    pathname === "/cart" ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/checkouts/");

  if (!isCheckoutPath) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(request.url);
  redirectUrl.protocol = "https:";
  redirectUrl.host = SHOPIFY_CHECKOUT_DOMAIN;
  redirectUrl.pathname = pathname;
  redirectUrl.search = search;

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/checkouts/:path*"],
};
