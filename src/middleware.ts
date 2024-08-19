import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Redirect to login page if not authenticated

  // PROFILE - INIT
  const isProfilePage = request.nextUrl.pathname.startsWith("/profile/");
  if (isProfilePage && request.nextUrl.pathname.endsWith(".near")) {
    return NextResponse.rewrite(`${request.url}/home`);
  }
  if (isProfilePage && request.nextUrl.pathname.endsWith(".near/")) {
    return NextResponse.rewrite(`${request.url}home`);
  }
  // PROFILE - END

  // POT - INIT
  const isPotPage = request.nextUrl.pathname.startsWith("/pot/");
  if (isPotPage && request.nextUrl.pathname.endsWith(".near")) {
    return NextResponse.rewrite(`${request.url}/projects`);
  }
  if (isPotPage && request.nextUrl.pathname.endsWith(".near/")) {
    return NextResponse.rewrite(`${request.url}projects`);
  }
  // POT - END

  return NextResponse.next();
}
