import { NextRequest, NextResponse } from "next/server";

import { rootPathnames } from "./pathnames";

export async function middleware(request: NextRequest) {
  // Is profile page?
  if (request.nextUrl.pathname.startsWith(`${rootPathnames.PROFILE}/`)) {
    const lastPathnameSegment = request.nextUrl.pathname.split("/").at(-1) ?? "unknown";
    const isImplicitAccountId = /^[a-fA-F0-9]{64}$/.test(lastPathnameSegment);

    if (
      isImplicitAccountId ||
      lastPathnameSegment.endsWith(".near") ||
      lastPathnameSegment.endsWith(".testnet")
    ) {
      return NextResponse.rewrite(`${request.url}/home`);
    } else if (
      lastPathnameSegment.endsWith(".near/") ||
      lastPathnameSegment.endsWith(".testnet/")
    ) {
      return NextResponse.rewrite(`${request.url}home`);
    }
  }

  // TODO: Consider removing this block in the future
  // Is pot page?
  // if (request.nextUrl.pathname.startsWith("/pot/")) {
  //   if (
  //     request.nextUrl.pathname.endsWith(".near") ||
  //     request.nextUrl.pathname.endsWith(".testnet")
  //   ) {
  //     return NextResponse.rewrite(`${request.url}/settings`);
  //   } else if (
  //     request.nextUrl.pathname.endsWith(".near/") ||
  //     request.nextUrl.pathname.endsWith(".testnet/")
  //   ) {
  //     return NextResponse.rewrite(`${request.url}settings`);
  //   } else if (request.nextUrl.pathname.includes(`${undefined}`)) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = rootPathnames.POTS;
  //     return NextResponse.rewrite(url);
  //   }
  // }

  return NextResponse.next();
}
