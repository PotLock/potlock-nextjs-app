import { NextRequest, NextResponse } from "next/server";

// import { rootPathnames } from "./pathnames";

export async function middleware(request: NextRequest) {
  const isProfilePage = request.nextUrl.pathname.startsWith("/profile/");
  const isPotPage = request.nextUrl.pathname.startsWith("/pot/");

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

  // TODO: Consider removing this block in the future
  if (isPotPage) {
    // if (
    //   request.nextUrl.pathname.endsWith(".near") ||
    //   request.nextUrl.pathname.endsWith(".testnet")
    // ) {
    //   return NextResponse.rewrite(`${request.url}/settings`);
    // } else if (
    //   request.nextUrl.pathname.endsWith(".near/") ||
    //   request.nextUrl.pathname.endsWith(".testnet/")
    // ) {
    //   return NextResponse.rewrite(`${request.url}settings`);
    // } else if (request.nextUrl.pathname.includes(`${undefined}`)) {
    //   const url = request.nextUrl.clone();
    //   url.pathname = rootPathnames.POTS;
    //   return NextResponse.rewrite(url);
    // }
  }

  return NextResponse.next();
}
