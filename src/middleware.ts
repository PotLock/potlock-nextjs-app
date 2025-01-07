import { NextRequest, NextResponse } from "next/server";

import { rootPathnames } from "./pathnames";

export async function middleware(request: NextRequest) {
  // Is profile page?
  if (request.nextUrl.pathname.startsWith(`${rootPathnames.PROFILE}/`)) {
    const lastPathnameSegment = request.nextUrl.pathname.split("/").at(-1) ?? "noop";
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

  return NextResponse.next();
}
