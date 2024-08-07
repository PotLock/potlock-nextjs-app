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

  return NextResponse.next();
}
