import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'
import type { UserRole } from '@prisma/client'

// Define protected routes and their allowed roles
const protectedRoutes = [
    {
        path: '/client/dashboard',
        roles: ['CLIENT'] as UserRole[],
    },
    {
        path: '/counsellor/dashboard',
        roles: ['COUNSELLOR'] as UserRole[],
    },
    {
        path: '/admin/dashboard',
        roles: ['ADMIN'] as UserRole[],
    },
    {
        path: '/org/dashboard',
        roles: ['ORG_CONTACT'] as UserRole[],
    },
    {
        path: '/client',
        roles: ['CLIENT'] as UserRole[],
    },
    {
        path: '/counsellor',
        roles: ['COUNSELLOR'] as UserRole[],
    },
    {
        path: '/admin',
        roles: ['ADMIN'] as UserRole[],
    },
    {
        path: '/org',
        roles: ['ORG_CONTACT'] as UserRole[],
    },
]

export function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // Add security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self';"
    )

    // Check if the path is protected
    const path = request.nextUrl.pathname

    // Skip middleware for public routes
    if (
        path.startsWith('/login') ||
        path.startsWith('/register') ||
        path.startsWith('/unauthorized') ||
        path.startsWith('/api/auth/login') ||
        path.startsWith('/api/auth/register')
    ) {
        return response
    }

    // Get token from cookie
    const token = request.cookies.get('token')?.value

    if (!token) {
        // Redirect to login if no token
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verify token
    const payload = verifyToken(token)

    if (!payload) {
        // Redirect to login if token is invalid
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check if user has required role for the path
    const protectedRoute = protectedRoutes.find(route => path.startsWith(route.path))

    if (protectedRoute && !protectedRoute.roles.includes(payload.role)) {
        // Redirect to unauthorized page if user doesn't have required role
        return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
} 