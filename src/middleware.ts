import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware runs on the Edge runtime (server-side) and therefore CANNOT read
 * localStorage. The app stores auth tokens in localStorage via Zustand persist,
 * so all route protection must be done client-side (see AuthGuard component).
 *
 * This middleware is intentionally kept as a passthrough.
 * If you want server-side auth in the future, switch to HttpOnly cookies.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|images|og-image.png).*)",
  ],
};
