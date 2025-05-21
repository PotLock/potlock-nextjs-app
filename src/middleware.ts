import { NextRequest, NextResponse } from "next/server";

import { safePositiveNumber } from "./common/lib";
import { rootPathnames, routeSelectors } from "./pathnames";

export const config = {
  matcher: [`${rootPathnames.PROFILE}/:path*`, `${rootPathnames.CAMPAIGN}/:path*`],
};

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
      return NextResponse.rewrite(`${request.url}/home`);
    } else if (
      lastPathnameSegment.endsWith(".near/") ||
      lastPathnameSegment.endsWith(".testnet/")
    ) {
      return NextResponse.rewrite(`${request.url}home`);
    }
  } else if (pathname.startsWith(`${rootPathnames.CAMPAIGN}/`)) {
    const campaignIdOrZero = safePositiveNumber.catch(0).parse(pathname.split("/").at(-1));

    if (campaignIdOrZero !== 0) {
      return NextResponse.redirect(routeSelectors.CAMPAIGN_BY_ID_LEADERBOARD(campaignIdOrZero));
    }
  }

  return NextResponse.next();
}
