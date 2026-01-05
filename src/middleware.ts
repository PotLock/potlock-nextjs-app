import { NextRequest, NextResponse } from "next/server";

import { rootPathnames } from "./navigation";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /en locale prefix - redirect to root path without locale
  // if (pathname.startsWith("/en")) {
  //   const pathWithoutLocale = pathname.replace(/^\/en/, "") || "/";
  //   const url = new URL(request.url);
  //   url.pathname = pathWithoutLocale;
  //   return NextResponse.redirect(url);
  // }

  if (pathname.startsWith(`${rootPathnames.PROFILE}/`)) {
    const lastPathnameSegment = pathname.split("/").at(-1) ?? "noop";
    const isImplicitAccountId = /^[a-fA-F0-9]{64}$/.test(lastPathnameSegment);

    if (
      isImplicitAccountId ||
      lastPathnameSegment.endsWith(".near") ||
      lastPathnameSegment.endsWith(".testnet")
    ) {
      const url = new URL(request.url);
      url.pathname = `${url.pathname.replace(/\/$/, "")}/home`;
      return NextResponse.rewrite(url);
    } else if (
      lastPathnameSegment.endsWith(".near/") ||
      lastPathnameSegment.endsWith(".testnet/")
    ) {
      const url = new URL(request.url);
      url.pathname = `${url.pathname}home`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
