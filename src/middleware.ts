import { NextResponse, type NextRequest } from "next/server";

// Simplified middleware for initial auth check
// In a real app, you'd decode the JWT or check a session cookie
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("userRole")?.value; // "client" or "provider"

  // Define protected routes
  const isProviderRoute = pathname.startsWith("/provider");
  const isClientRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/bookings");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Redirect unauthenticated users
  if ((isProviderRoute || isClientRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    const dashboardUrl =
      userRole === "provider"
        ? new URL("/provider/dashboard", request.url)
        : new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Role-based access control
  if (isProviderRoute && userRole !== "provider") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isClientRoute && userRole === "provider") {
    return NextResponse.redirect(new URL("/provider/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|images|og-image.png).*)",
  ],
};
理论上;
