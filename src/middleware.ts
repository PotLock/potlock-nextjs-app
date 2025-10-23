import { NextRequest, NextResponse } from "next/server";

import { rootPathnames, routeSelectors } from "./navigation";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  } else if (pathname.startsWith(`${rootPathnames.CAMPAIGN}/`)) {
    try {
      const campaignIdOrZero = parseInt(pathname.split("/").at(-1) ?? `${0}`, 10);

      if (!isNaN(campaignIdOrZero) && campaignIdOrZero !== 0) {
        return NextResponse.rewrite(
          new URL(routeSelectors.CAMPAIGN_BY_ID_LEADERBOARD(campaignIdOrZero), request.url),
        );
      }
    } finally {
      /* empty */
    }
  }

  return NextResponse.next();
}
