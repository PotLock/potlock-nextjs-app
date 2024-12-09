import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // PROFILE - INIT
  const isProfilePage = request.nextUrl.pathname.startsWith("/profile/");

  if (
    isProfilePage &&
    (request.nextUrl.pathname.endsWith(".near") || request.nextUrl.pathname.endsWith(".testnet"))
  ) {
    return NextResponse.rewrite(`${request.url}/home`);
  } else if (
    isProfilePage &&
    (request.nextUrl.pathname.endsWith(".near/") || request.nextUrl.pathname.endsWith(".testnet/"))
  ) {
    return NextResponse.rewrite(`${request.url}home`);
  }
  // PROFILE - END

  // POT - INIT
  const isPotPage = request.nextUrl.pathname.startsWith("/pot/");

  if (
    isPotPage &&
    (request.nextUrl.pathname.endsWith(".near") || request.nextUrl.pathname.endsWith(".testnet"))
  ) {
    return NextResponse.rewrite(`${request.url}/projects`);
  } else if (
    isPotPage &&
    (request.nextUrl.pathname.endsWith(".near/") || request.nextUrl.pathname.endsWith(".testnet/"))
  ) {
    return NextResponse.rewrite(`${request.url}projects`);
  }
  // POT - END

  return NextResponse.next();
}
