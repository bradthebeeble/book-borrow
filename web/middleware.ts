import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './src/auth'

// Define route categories for protection
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/verify-request',
  '/about',
  '/contact',
  '/terms',
  '/privacy'
]

const authRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/verify-request'
]

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/communities',
  '/books',
  '/messages',
  '/settings'
]

const parentOnlyRoutes = [
  '/children',
  '/parent-dashboard'
]

const adminRoutes = [
  '/admin'
]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userIsParent = req.auth?.user?.isParent || false

  const isPublicRoute = publicRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
  )
  
  const isAuthRoute = authRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
  )
  
  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(`${route}/`) || nextUrl.pathname === route
  )
  
  const isParentOnlyRoute = parentOnlyRoutes.some(route => 
    nextUrl.pathname.startsWith(`${route}/`) || nextUrl.pathname === route
  )
  
  const isAdminRoute = adminRoutes.some(route => 
    nextUrl.pathname.startsWith(`${route}/`) || nextUrl.pathname === route
  )

  // Handle authentication routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      // Redirect authenticated users away from auth pages
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
    return NextResponse.next()
  }

  // Handle public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Handle protected routes
  if (isProtectedRoute || isParentOnlyRoute || isAdminRoute) {
    if (!isLoggedIn) {
      // Store the original URL for redirect after login
      const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search)
      return NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${callbackUrl}`, nextUrl)
      )
    }

    // Check parent-only routes
    if (isParentOnlyRoute && !userIsParent) {
      return NextResponse.redirect(new URL('/unauthorized', nextUrl))
    }

    // Check admin routes (for now, treat as parent-only, but can be extended)
    if (isAdminRoute && !userIsParent) {
      return NextResponse.redirect(new URL('/unauthorized', nextUrl))
    }

    return NextResponse.next()
  }

  // Default: allow access to any other routes
  return NextResponse.next()
})

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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}