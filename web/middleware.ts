import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // // const token = request.cookies.get("token")?.value;
  // const pathname = request.nextUrl.pathname;

  // if (pathname.startsWith("/sistema")) {
  // if (!token) {
  // const loginUrl = new URL("/login", request.url);
  // return NextResponse.redirect(loginUrl);
  // }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sistema/:path*"],
};
