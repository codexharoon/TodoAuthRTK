import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    if (
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/signup")
    ) {
      return NextResponse.rewrite(new URL("/", request.url));
    }
  } else {
    if (
      request.nextUrl.pathname.startsWith("/") ||
      request.nextUrl.pathname.startsWith("/signin") ||
      request.nextUrl.pathname.startsWith("/signup")
    ) {
      return NextResponse.rewrite(new URL("/dashboard", request.url));
    }
  }
}

export const config = {
  matcher: ["/", "/signup", "/signin", "/dashboard"],
};

export default middleware;
