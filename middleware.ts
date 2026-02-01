import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password'];

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/profile',
  '/settings',
  '/branch',
  '/customers',
  '/followup',
  '/contracts',
  '/agents',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Static files like .js, .css, .png, etc.
  ) {
    return NextResponse.next();
  }

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // Get the auth token from cookies
  const authToken = request.cookies.get('authToken')?.value;

  console.log(
    `[Middleware] Path: ${pathname}, Token: ${authToken ? 'EXISTS' : 'NONE'}, Protected: ${isProtectedRoute}`
  );

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !authToken) {
    console.log(`[Middleware] Redirecting to login - no auth token`);
    const loginUrl = new URL('/login', request.url);

    // Append the original path as a redirect parameter
    loginUrl.searchParams.set('redirect', encodeURIComponent(pathname));

    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from public routes (like login page)
  if (isPublicRoute && authToken && pathname === '/login') {
    console.log(`[Middleware] Redirecting to dashboard - already authenticated`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$).*)',
  ],
};
