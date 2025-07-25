import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    
    if (pathname.startsWith("/auth")) {
      const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
      if (callbackUrl && callbackUrl.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL(callbackUrl, req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        if (pathname.startsWith("/auth")) {
          return !token;
        }

        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/auth/sign-in",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
  ],
};
